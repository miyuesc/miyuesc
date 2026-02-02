<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { githubService, type PostMeta } from '@/services/github';
import LoadingScanner from '@/components/core/LoadingScanner.vue';
import BackToTop from '@/components/core/BackToTop.vue';
import Pagination from '@/components/common/Pagination.vue';
import { CalendarIcon, ChevronRightIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/vue/24/outline';
import gsap from 'gsap';

const posts = ref<PostMeta[]>([]);
const loading = ref(true);
const isInitialLoading = ref(true);
const page = ref(1);
const itemsPerPage = 12;
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

// Computed paginated posts
const displayedPosts = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPosts.value.slice(start, end);
});

const totalItems = computed(() => filteredPosts.value.length);

const fetchData = async () => {
  loading.value = true;
  try {
    // Cache check
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
    // Animate initial load
    nextTick(animateItems);
  }
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

// Reset page on search
watch(searchQuery, () => {
  page.value = 1;
});

// Animate items whenever displayed list changes
watch(displayedPosts, () => {
  nextTick(animateItems);
});

const animateItems = () => {
  const items = document.querySelectorAll('.post-card');
  if (items.length === 0) return;

  // Explicitly animate from invisible to visible
  gsap.fromTo(items, 
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      clearProps: 'transform' // Only clear transform to keep opacity info if needed, or 'all' but be careful with hover stats.
                              // Actually clearProps: 'all' is fine as opacity 1 is default.
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
    <div class="mb-12 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
      <div>
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-tighter">
          Data <span class="text-neon-cyan">Streams</span>
        </h1>
        <p class="text-gray-400 font-mono text-sm max-w-xl">
          Accessing encrypted knowledge archives. Total Entries: <span class="text-neon-cyan">{{ totalItems }}</span>
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

    <div v-else class="max-w-4xl mx-auto flex flex-col gap-8">
      <div v-if="displayedPosts.length === 0" class="text-center py-20 text-gray-500 font-mono">
        [NO_DATA_FOUND] Refine your search query.
      </div>

      <div class="space-y-4">
        <router-link 
          v-for="post in displayedPosts" 
          :key="post.sha" 
          :to="`/posts/${encodeURIComponent(post.path)}`"
          class="post-card group block p-6 bg-white/5 border border-white/10 hover:border-neon-cyan/50 rounded-xl transition-all duration-300 backdrop-blur-md relative overflow-hidden hover:bg-white/10 hover:-translate-y-1 shadow-lg"
        >
          <!-- Hover Gradient -->
          <div class="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10 flex gap-6 items-start">
            <!-- Icon Box -->
            <div class="hidden md:flex p-3 bg-gray-900/50 rounded-lg group-hover:bg-neon-cyan/20 transition-colors border border-white/10 shrink-0">
               <DocumentTextIcon class="w-6 h-6 text-neon-cyan" />
            </div>

            <div class="flex-1 min-w-0">
               <!-- Meta Header -->
               <div class="flex items-center gap-3 mb-3">
                 <DocumentTextIcon class="w-4 h-4 text-neon-cyan md:hidden" />
                 <span class="text-[10px] font-mono text-neon-cyan uppercase tracking-widest border border-neon-cyan/20 bg-neon-cyan/5 px-2 py-0.5 rounded">
                    ARCHIVE_ENTRY
                 </span>
                 <span class="text-xs text-gray-500 font-mono ml-auto flex items-center gap-1 group-hover:text-gray-400 transition-colors">
                    <CalendarIcon class="w-3 h-3" /> {{ post.date }}
                 </span>
               </div>

               <!-- Title -->
               <h2 class="text-xl md:text-2xl font-bold text-white group-hover:text-neon-cyan transition-colors mb-4 flex items-center gap-2">
                 {{ post.title }}
               </h2>

               <!-- Footer Info -->
               <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-500">
                  <div class="flex items-center gap-4">
                     <span class="opacity-60">ID: {{ post.sha.substring(0, 7) }}</span>
                     <span class="text-neon-purple opacity-80">READ_ACCESS: GRANTED</span>
                  </div>
                  <ChevronRightIcon class="w-4 h-4 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
               </div>
            </div>
          </div>
        </router-link>
      </div>
      
      <!-- Pagination -->
      <Pagination 
        :current-page="page" 
        :total-items="totalItems" 
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
      />
    </div>

    <BackToTop />
  </div>
</template>
