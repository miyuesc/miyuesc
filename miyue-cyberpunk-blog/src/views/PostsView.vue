<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { githubService, type PostMeta } from '@/services/github';
import LoadingScanner from '@/components/core/LoadingScanner.vue';
import BackToTop from '@/components/core/BackToTop.vue';
import { CalendarIcon, ChevronRightIcon, MagnifyingGlassIcon, DocumentTextIcon, FolderIcon, HomeIcon, ArrowUturnLeftIcon, ViewColumnsIcon, ListBulletIcon } from '@heroicons/vue/24/outline';
import gsap from 'gsap';

const posts = ref<PostMeta[]>([]);
const loading = ref(true);
const isInitialLoading = ref(true);
const searchQuery = ref('');
const currentPath = ref<string[]>([]); // Stack of folder names
const viewMode = ref<'list' | 'columns'>('list');

// --- Search Logic (Flat View) ---
const filteredPosts = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.date.includes(query)
  );
});

// --- Directory Logic (Common) ---
interface FileSystemItem {
  type: 'folder' | 'file';
  name: string;
  path: string; // Full path for file, or current path for folder
  date?: string;
  count?: number; // Only for folders
  postRaw?: PostMeta; // Only for files
}

// Helper to get items for a specific path level
const getItemsForPath = (targetPathParts: string[]) => {
  const items: Map<string, FileSystemItem> = new Map();
  const targetPathStr = targetPathParts.join('/');
  
  posts.value.forEach(post => {
    const parts = post.path.split('/');
    
    // Filter out items not in this tree branch
    const postPathStr = parts.slice(0, targetPathParts.length).join('/');
    if (targetPathStr && postPathStr !== targetPathStr) return;

    // Identify the direct child
    const childIndex = targetPathParts.length;
    if (childIndex >= parts.length) return;

    const childName = parts[childIndex];
    const isFile = childIndex === parts.length - 1;

    if (isFile) {
      if (!items.has(childName)) {
        items.set(childName, {
          type: 'file',
          name: post.title,
          path: post.path,
          date: post.date,
          postRaw: post
        });
      }
    } else {
      // It's a folder
      if (!items.has(childName)) {
        items.set(childName, {
          type: 'folder',
          name: childName, // Folder name, e.g. "DevOps"
          path: [...targetPathParts, childName].join('/'),
          count: 1 // Initial count
        });
      } else {
        const item = items.get(childName)!;
        if (item.type === 'folder' && item.count !== undefined) {
           item.count++;
        }
      }
    }
  });

  // Sort: Folders first, then Files
  return Array.from(items.values()).sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'folder' ? -1 : 1;
  });
};

// --- List View Data ---
const currentLevelContent = computed<FileSystemItem[]>(() => {
  if (searchQuery.value) return [];
  return getItemsForPath(currentPath.value);
});

// --- Column View Data ---
// We need an array of arrays. 
// Column 0: Root items
// Column 1: Items in currentPath[0]
// Column 2: Items in currentPath[0]/currentPath[1]
// ...
const columnsData = computed(() => {
   if (viewMode.value !== 'columns') return [];
   
   const cols: FileSystemItem[][] = [];
   
   // Root Column
   cols.push(getItemsForPath([]));

   // Subsequent Columns based on currentPath
   let tempPath: string[] = [];
   for (const folder of currentPath.value) {
      tempPath.push(folder);
      const items = getItemsForPath([...tempPath]);
      // Only add column if it has items? Or empty column for empty folder?
      // Finder shows empty column.
      if (items.length > 0) {
         cols.push(items);
      }
   }
   
   return cols;
});

const totalItems = computed(() => searchQuery.value ? filteredPosts.value.length : posts.value.length);

// Navigation
const navigateToFolder = (folderName: string, levelIndex?: number) => {
  if (viewMode.value === 'columns' && levelIndex !== undefined) {
     const newPath = currentPath.value.slice(0, levelIndex);
     newPath.push(folderName);
     currentPath.value = newPath;
  } else {
     // List Mode: just push
     currentPath.value.push(folderName);
  }
};

const navigateUp = () => {
  if (currentPath.value.length > 0) {
    currentPath.value.pop();
  }
};

const navigateHome = () => {
  currentPath.value = [];
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'columns' : 'list';
  nextTick(animateItems);
};

const fetchData = async () => {
  loading.value = true;
  try {
    const cached = sessionStorage.getItem('miyue_blog_posts');
    if (cached) {
      posts.value = JSON.parse(cached);
    } else {
      const data = await githubService.getPosts();
      posts.value = data;
      sessionStorage.setItem('miyue_blog_posts', JSON.stringify(data));
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isInitialLoading.value = false;
    nextTick(animateItems);
  }
};

watch(searchQuery, () => {
  if (searchQuery.value) {
    nextTick(animateItems);
  } else {
    nextTick(animateItems);
  }
});

// Watch columns to scroll to right
watch(columnsData, () => {
   if (viewMode.value === 'columns') {
      nextTick(() => {
         const container = document.getElementById('columns-container');
         if (container) {
            gsap.to(container, { scrollLeft: container.scrollWidth, duration: 0.5, ease: 'power2.out' });
         }
         animateItems();
      });
   }
}, { deep: true });

watch([currentPath, currentLevelContent, viewMode], () => {
  nextTick(animateItems);
}, { deep: true });

const animateItems = () => {
  const items = document.querySelectorAll('.list-item-anim:not([data-animated])');
  if (items.length === 0) return;

  gsap.fromTo(items, 
    { opacity: 0, x: -10 }, 
    {
      opacity: 1,
      x: 0,
      duration: 0.3,
      stagger: 0.02,
      ease: 'power2.out',
      clearProps: 'transform',
      onComplete: () => {
        items.forEach(el => el.setAttribute('data-animated', 'true'));
      }
    }
  );
};

onMounted(async () => {
  window.scrollTo(0, 0);
  await fetchData();
});
</script>

<template>
  <div class="container mx-auto px-4 py-20 min-h-screen">
    <div class="mb-8 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-tighter">
          Data <span class="text-neon-cyan">Streams</span>
        </h1>
        <p class="text-gray-400 font-mono text-sm max-w-xl">
          <span v-if="searchQuery">Search Results: <span class="text-neon-cyan">{{ filteredPosts.length }}</span> matches</span>
          <span v-else>Current Directory: <span class="text-neon-cyan">~/{{ currentPath.join('/') }}</span></span>
        </p>
      </div>

      <div class="flex items-center gap-4 w-full md:w-auto">
         <!-- View Mode Toggle -->
         <div v-if="!searchQuery" class="flex items-center gap-1 bg-gray-900 border border-gray-700 rounded-lg p-1">
            <button 
               @click="viewMode = 'list'"
               class="p-1.5 rounded transition-all"
               :class="viewMode === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'"
               title="List View"
            >
               <ListBulletIcon class="w-5 h-5" />
            </button>
            <button 
               @click="viewMode = 'columns'"
               class="p-1.5 rounded transition-all"
               :class="viewMode === 'columns' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'"
               title="Columns View"
            >
               <ViewColumnsIcon class="w-5 h-5" />
            </button>
         </div>

        <!-- Search Box -->
        <div class="flex-1 md:w-auto relative group">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-neon-cyan transition-colors">
            <MagnifyingGlassIcon class="w-5 h-5" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="SEARCH ARCHIVES..." 
            class="w-full md:w-64 bg-black/50 border border-gray-700 rounded py-2 pl-10 pr-4 text-sm font-mono text-white focus:outline-none focus:border-neon-cyan transition-colors placeholder-gray-600"
          >
          <div class="absolute inset-0 border border-neon-cyan/50 rounded opacity-0 scale-105 group-focus-within:opacity-100 group-focus-within:scale-100 transition-all pointer-events-none"></div>
        </div>
      </div>
    </div>

    <!-- Initial Loading -->
    <div v-if="isInitialLoading" class="py-20 flex justify-center">
      <LoadingScanner :loading="true" text="Decrypting Archives..." />
    </div>

    <div v-else class="max-w-7xl mx-auto flex flex-col gap-6"> <!-- Expanded width for columns -->
      
      <!-- Breadcrumbs & Navigation (Only when not searching & List view) -->
      <div v-if="!searchQuery && viewMode === 'list'" class="flex items-center gap-2 text-sm font-mono mb-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
        <button 
          @click="navigateHome" 
          class="flex items-center gap-1 hover:text-neon-cyan transition-colors"
          :class="currentPath.length === 0 ? 'text-neon-cyan' : 'text-gray-500'"
        >
          <HomeIcon class="w-4 h-4" /> root
        </button>
        
        <template v-for="(folder, index) in currentPath" :key="index">
          <span class="text-gray-600">/</span>
          <button 
            @click="currentPath = currentPath.slice(0, index + 1)"
             class="hover:text-neon-cyan transition-colors"
             :class="index === currentPath.length - 1 ? 'text-neon-cyan' : 'text-gray-500'"
          >
            {{ folder }}
          </button>
        </template>
        
        <button 
            v-if="currentPath.length > 0" 
            @click="navigateUp" 
            class="ml-auto flex items-center gap-1 px-3 py-1 border border-gray-800 rounded hover:border-neon-cyan hover:text-neon-cyan transition-colors text-xs"
        >
            <ArrowUturnLeftIcon class="w-3 h-3" /> UP
        </button>
      </div>

      <!-- Logic Branch: Search View VS Directory View -->
      <div v-if="searchQuery" class="space-y-4">
          <div v-if="filteredPosts.length === 0" class="text-center py-20 text-gray-500 font-mono">
             [NO_DATA_FOUND] Refine your search query.
          </div>
          
           <router-link 
            v-for="post in filteredPosts" 
            :key="post.sha" 
            :to="`/posts/${encodeURIComponent(post.path)}`"
            class="list-item-anim post-card group block p-4 bg-white/5 border border-white/10 hover:border-neon-cyan/50 rounded-xl transition-all duration-300 relative overflow-hidden hover:bg-white/10"
          >
             <div class="flex items-center gap-4">
                 <DocumentTextIcon class="w-5 h-5 text-gray-500 group-hover:text-neon-cyan transition-colors" />
                 <div class="flex-1 min-w-0">
                     <div class="text-sm font-bold text-gray-200 group-hover:text-neon-cyan truncate">{{ post.title }}</div>
                     <div class="text-[10px] text-gray-600 font-mono">{{ post.path }}</div>
                 </div>
                 <div class="text-xs text-gray-600 font-mono hidden md:block">{{ post.date }}</div>
             </div>
          </router-link>
      </div>

      <!-- COLUMNS VIEW (Finder Style) -->
      <div 
        id="columns-container"
        v-else-if="viewMode === 'columns'" 
        class="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 h-[60vh]"
      >
         <div 
            v-for="(levelItems, levelIndex) in columnsData" 
            :key="levelIndex"
            class="flex-shrink-0 w-64 md:w-80 bg-black/40 border border-white/5 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm"
         >
            <div class="p-2 border-b border-white/5 text-[10px] font-mono text-gray-500 uppercase tracking-wider bg-white/5">
               Level {{ levelIndex }} <span v-if="levelItems.length > 0">({{ levelItems.length }})</span>
            </div>
            
            <div class="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
               <template v-for="item in levelItems" :key="item.path">
                  <div 
                     class="list-item-anim group flex items-center gap-3 p-2 rounded cursor-pointer transition-all duration-200"
                     :class="[
                        currentPath[levelIndex] === item.name 
                           ? 'bg-neon-cyan/20 border-neon-cyan/30 text-neon-cyan' 
                           : 'hover:bg-white/5 text-gray-300 border-transparent border'
                     ]"
                     @click="item.type === 'folder' 
                        ? navigateToFolder(item.name, levelIndex) 
                        : $router.push(`/posts/${encodeURIComponent(item.path)}`)
                     "
                  >
                     <FolderIcon v-if="item.type === 'folder'" class="w-5 h-5 flex-shrink-0" :class="currentPath[levelIndex] === item.name ? 'text-neon-cyan' : 'text-yellow-500/80'" />
                     <DocumentTextIcon v-else class="w-5 h-5 flex-shrink-0" :class="currentPath[levelIndex] === item.name ? 'text-neon-cyan' : 'text-gray-500'" />
                     
                     <span class="truncate text-sm flex-1 font-mono">{{ item.name }}</span>
                     
                     <ChevronRightIcon v-if="item.type === 'folder'" class="w-3 h-3 text-gray-600" />
                  </div>
               </template>
               <div v-if="levelItems.length === 0" class="text-center py-10 text-xs text-gray-600 font-mono">
                  [EMPTY]
               </div>
            </div>
         </div>
      </div>

      <!-- LIST VIEW (Original Tree) -->
      <div v-else class="space-y-3">
         <div v-if="currentLevelContent.length === 0" class="text-center py-20 text-gray-500 font-mono">
            [EMPTY_DIRECTORY] No artifacts found.
         </div>

         <!-- File System Items -->
         <div 
            v-for="item in currentLevelContent" 
            :key="item.path"
            class="list-item-anim group block p-4 bg-black/40 border border-gray-800/50 hover:border-neon-cyan/50 rounded-lg transition-all duration-200 cursor-pointer hover:bg-white/5 backdrop-blur-sm"
            @click="item.type === 'folder' ? navigateToFolder(item.name) : $router.push(`/posts/${encodeURIComponent(item.path)}`)"
         >
            <div class="flex items-center gap-4">
               <!-- Icon -->
               <div class="shrink-0 p-2 rounded bg-white/5 group-hover:bg-neon-cyan/10 transition-colors">
                  <FolderIcon v-if="item.type === 'folder'" class="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 fill-yellow-500/10" />
                  <DocumentTextIcon v-else class="w-6 h-6 text-neon-cyan group-hover:text-white" />
               </div>

               <!-- Content -->
               <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                      <span class="text-base font-bold text-gray-200 group-hover:text-neon-cyan transition-colors truncate">
                          {{ item.name }}
                      </span>
                      <!-- Folder Badge -->
                       <span v-if="item.type === 'folder'" class="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-500 font-mono group-hover:text-white transition-colors">
                           {{ item.count }} items
                       </span>
                  </div>
                  
                  <!-- Meta -->
                  <div class="flex items-center gap-4 mt-1 text-xs text-gray-600 font-mono">
                      <span v-if="item.type === 'file'">{{ item.date }}</span>
                      <span v-if="item.type === 'file'">LOG_ID: {{ item.postRaw?.sha.substring(0, 7) }}</span>
                      <span v-if="item.type === 'folder'" class="text-gray-700">DIR_ACCESS: PUBLIC</span>
                  </div>
               </div>
               
               <!-- Arrow -->
               <ChevronRightIcon class="w-5 h-5 text-gray-700 group-hover:text-neon-cyan group-hover:translate-x-1 transition-transform" />
            </div>
         </div>
      </div>
    </div>

    <BackToTop />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 243, 255, 0.5);
}
.custom-scrollbar {
  overscroll-behavior: contain;
}
</style>
