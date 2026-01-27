<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { githubService, type PostMeta } from '@/services/github';
import LoadingScanner from '@/components/core/LoadingScanner.vue';
import BackToTop from '@/components/core/BackToTop.vue';
import { CalendarIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import gsap from 'gsap';

const posts = ref<PostMeta[]>([]);
const displayedPosts = ref<PostMeta[]>([]);
const loading = ref(true);
const isInitialLoading = ref(true);
const page = ref(1);
const itemsPerPage = 12; // Increased to ensure fill screen
const hasMore = ref(true);
const isAppending = ref(false);
const sentinelRef = ref<HTMLElement | null>(null);
const searchQuery = ref('');

// Computed filtered posts
const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value;
  const query = searchQuery.value.toLowerCase();
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.date.includes(query)
  );
});

const fetchData = async () => {
  loading.value = true;
  try {
    // Cache check
    const cached = sessionStorage.getItem('miyue_blog_posts');
    if (cached) {
      posts.value = JSON.parse(cached);
      console.log('Loaded posts from cache');
    } else {
      const data = await githubService.getPosts();
      posts.value = data;
      sessionStorage.setItem('miyue_blog_posts', JSON.stringify(data));
    }
    loadMoreItems(true);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isInitialLoading.value = false;
  }
};

const loadMoreItems = (reset = false) => {
  if (reset) {
    page.value = 1;
    displayedPosts.value = [];
    hasMore.value = true;
    isAppending.value = false;
  }
  
  const currentFiltered = filteredPosts.value;
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const newItems = currentFiltered.slice(start, end);
  
  if (displayedPosts.value.length + newItems.length >= currentFiltered.length) {
    hasMore.value = false;
  } else {
    hasMore.value = true; // Ensure hasMore is correct when refiltering
  }
  
  if (reset) {
    displayedPosts.value = newItems;
  } else {
    displayedPosts.value = [...displayedPosts.value, ...newItems];
  }
  
  if (newItems.length > 0) {
    isAppending.value = true;
    nextTick(() => {
      animateNewItems();
    });
  }
};

// Search Watcher
watch(searchQuery, () => {
  loadMoreItems(true);
});

const handleLoadMore = () => {
  if (!hasMore.value || loading.value || isAppending.value) return;
  page.value++;
  loadMoreItems();
};

const animateNewItems = () => {
  const items = document.querySelectorAll('.post-card.opacity-0');
  if (items.length === 0) {
    isAppending.value = false;
    return;
  }

  gsap.to(items, {
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.05, // Faster stagger
    ease: 'power2.out',
    onComplete: () => {
      isAppending.value = false;
    }
  });
};

onMounted(async () => {
  window.scrollTo(0, 0);
  await fetchData();
  
  // Robust Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isInitialLoading.value && !loading.value && hasMore.value) {
      handleLoadMore();
    }
  }, { rootMargin: '200px', threshold: 0.1 }); // Increased rootMargin for smoother infinite scroll logic
  
  if (sentinelRef.value) observer.observe(sentinelRef.value);
});
</script>

<template>
  <div class="container mx-auto px-4 py-20 min-h-screen">
    <div class="mb-12 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-tighter">
          Data <span class="text-neon-cyan">Streams</span>
        </h1>
        <p class="text-gray-400 font-mono text-sm max-w-xl">
          Accessing encrypted knowledge archives. Total Entries: <span class="text-neon-cyan">{{ filteredPosts.length }}</span>
        </p>
      </div>

      <!-- Search Box -->
      <div class="w-full md:w-auto relative group">
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

    <!-- Initial Loading -->
    <div v-if="isInitialLoading" class="py-20 flex justify-center">
      <LoadingScanner :loading="true" text="Decrypting Archives..." />
    </div>

    <div v-else class="space-y-4 max-w-4xl mx-auto">
      <div v-if="displayedPosts.length === 0" class="text-center py-20 text-gray-500 font-mono">
        [NO_DATA_FOUND] Refine your search query.
      </div>

      <router-link 
        v-for="post in displayedPosts" 
        :key="post.sha" 
        :to="`/posts/${encodeURIComponent(post.path)}`"
        class="post-card opacity-0 -translate-x-4 group block p-6 bg-white/5 border border-white/10 hover:border-neon-cyan/50 rounded transition-all duration-300 backdrop-blur-md relative overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative z-10 flex flex-col items-start gap-4">
          <div class="w-full space-y-2">
            <div class="flex items-center gap-2 text-[10px] font-mono text-neon-cyan uppercase tracking-widest">
              <span class="w-1.5 h-1.5 bg-neon-cyan animate-pulse"></span>
              ARCHIVE_ENTRY
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors pr-8">
              {{ post.title }}
            </h2>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500">
              <span class="flex items-center gap-1"><CalendarIcon class="w-3 h-3" /> {{ post.date }}</span>
              <span class="whitespace-nowrap">READ_ACCESS: GRANTED</span>
            </div>
          </div>
          <div class="absolute right-0 top-0 md:relative md:top-auto md:right-auto self-end md:self-center">
            <ChevronRightIcon class="w-6 h-6 text-gray-700 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </router-link>
    </div>

    <!-- Sentinel -->
    <div ref="sentinelRef" v-show="!isInitialLoading" class="py-12 flex justify-center flex-col items-center gap-4 h-32">
       <div v-if="hasMore" class="w-full flex justify-center opacity-70">
          <div class="animate-spin h-6 w-6 border-2 border-neon-cyan border-t-transparent rounded-full"></div>
       </div>
      
      <div v-if="!hasMore && !loading && displayedPosts.length > 0" class="text-center text-gray-600 font-mono text-xs uppercase tracking-[0.3em] flex flex-col items-center gap-2">
         <div class="flex gap-1 mb-2">
          <div v-for="i in 3" :key="i" class="w-1 h-4 bg-neon-cyan/20"></div>
        </div>
        --- End of Knowledge Stream ---
      </div>
    </div>

    <BackToTop />
  </div>
</template>
