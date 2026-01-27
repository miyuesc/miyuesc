<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { githubService, type GitHubRepo } from '@/services/github';
import { CodeBracketIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/20/solid';
import LoadingScanner from '@/components/core/LoadingScanner.vue';
import BackToTop from '@/components/core/BackToTop.vue';
import gsap from 'gsap';

const allRepos = ref<GitHubRepo[]>([]);
const displayedRepos = ref<GitHubRepo[]>([]);
const loading = ref(true);
const isInitialLoading = ref(true);
const sortBy = ref<'stars' | 'date'>('stars');
const page = ref(1);
const itemsPerPage = 12;
const hasMore = ref(true);
const isAppending = ref(false);
const sentinelRef = ref<HTMLElement | null>(null);
let checkInterval: number | null = null;

// Gitee Mapping based on README
const giteeMap: Record<string, string> = {
  'bpmn-process-designer': 'miyuesc/bpmn-process-designer',
  'vite-vue-bpmn-process': 'miyuesc/vite-vue-bpmn-process',
  'vue-data-visualization': 'miyuesc/vue-data-visualization'
};

const getGiteeUrl = (repoName: string) => {
  return giteeMap[repoName] ? `https://gitee.com/${giteeMap[repoName]}` : null;
};

// Fetch Data
const fetchData = async () => {
  loading.value = true;
  try {
    const cached = sessionStorage.getItem('miyue_blog_repos');
    if (cached) {
      allRepos.value = JSON.parse(cached);
      console.log('Loaded repos from cache');
    } else {
      const repos = await githubService.getUserRepos();
      allRepos.value = repos;
      sessionStorage.setItem('miyue_blog_repos', JSON.stringify(repos));
    }
    sortAndPaginate(true);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isInitialLoading.value = false;
  }
};

// Sort & Pagination Logic
const sortAndPaginate = (reset = false) => {
  if (reset) {
    page.value = 1;
    displayedRepos.value = [];
    hasMore.value = true;
    isAppending.value = false;
  }

  // Sort
  const sorted = [...allRepos.value].sort((a, b) => {
    if (sortBy.value === 'stars') {
      return b.stargazers_count - a.stargazers_count;
    } else {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  // Paginate
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const newItems = sorted.slice(start, end);
  
  if (newItems.length < itemsPerPage || end >= sorted.length) {
    hasMore.value = false;
  }
  
  // Append new items
  displayedRepos.value = [...displayedRepos.value, ...newItems];
  
  // Trigger animation next tick to ensure DOM is updated
  isAppending.value = true;
  nextTick(() => {
    animateNewItems();
    
    // Check if we need to load more immediately (if screen not full)
    // Doing this here ensures we check as soon as DOM is ready, parallel to animation
     if (sentinelRef.value && hasMore.value && !loading.value) {
        const rect = sentinelRef.value.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 100) {
            loadMore();
        }
    }
  });
};

const loadMore = () => {
  // Strict check to prevent multiple triggers
  if (!hasMore.value || loading.value) return;
  page.value++;
  sortAndPaginate();
};

const animateNewItems = () => {
  const items = document.querySelectorAll('.project-card.opacity-0');
  if (items.length === 0) {
    isAppending.value = false;
    return;
  }
  
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
    onComplete: () => {
      // Release lock only after animation finishes
      isAppending.value = false;
    }
  });
};

// Toggle Sort
const toggleSort = () => {
  sortBy.value = sortBy.value === 'stars' ? 'date' : 'stars';
  // Reset scroll
  window.scrollTo({ top: 0, behavior: 'smooth' });
  sortAndPaginate(true);
};

// Infinite Scroll Observer
onMounted(async () => {
  await fetchData();

  const observer = new IntersectionObserver((entries) => {
    // Only trigger if intersecting AND not currently doing anything
    if (entries[0].isIntersecting && !isInitialLoading.value && !loading.value && hasMore.value) {
      loadMore();
    }
  }, { 
    rootMargin: '100px',
    threshold: 0.1
  });
  
  // Watch for isAppending state changes to re-check intersection if user is still at bottom
  // This fixes the "stuck at bottom" issue
  checkInterval = setInterval(() => {
    if (sentinelRef.value && !loading.value && hasMore.value) {
       const rect = sentinelRef.value.getBoundingClientRect();
       if (rect.top <= window.innerHeight + 100) { // +100 margin
         loadMore();
       }
    }
  }, 500) as unknown as number;

  if (sentinelRef.value) observer.observe(sentinelRef.value);
});

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-20 min-h-screen relative">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-gray-800 pb-8">
      <div>
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-2 uppercase tracking-tighter">
          Open Source <span class="text-neon-cyan">Inventory</span>
        </h1>
        <p class="text-gray-400 font-mono text-sm max-w-xl">
          Scanning remote code registries. Current archives: <span class="text-neon-cyan">{{ allRepos.length }} units</span>.
        </p>
      </div>

      <!-- Controls -->
      <button 
        @click="toggleSort" 
        class="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded hover:border-neon-cyan hover:text-neon-cyan transition-colors text-sm font-mono group"
      >
        <ArrowPathIcon class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" :class="{ 'animate-spin': loading }" />
        SORT_ORDER: {{ sortBy === 'stars' ? 'STARS' : 'DATE' }}
      </button>
    </div>

    <!-- Initial Loading State -->
    <div v-if="isInitialLoading" class="py-20 flex justify-center">
      <LoadingScanner :loading="true" text="Initializing Knowledge Base..." />
    </div>

    <!-- Grid -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <a 
        v-for="repo in displayedRepos" 
        :key="repo.id" 
        :href="repo.html_url" 
        target="_blank"
        class="project-card opacity-0 translate-y-4 group p-6 bg-white/5 border border-white/10 hover:border-neon-cyan/50 rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full shadow-lg"
      >
        <!-- Hover Gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div class="relative z-10 flex flex-col h-full">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 bg-gray-900/50 rounded-lg group-hover:bg-neon-cyan/20 transition-colors border border-white/10">
              <CodeBracketIcon class="w-6 h-6 text-neon-cyan" />
            </div>
            
            <div class="flex flex-col items-end gap-1">
               <span class="text-xs font-mono text-gray-400 bg-black/40 px-2 py-1 rounded border border-white/5">
                {{ repo.language || 'Code' }}
              </span>
              <!-- Gitee Badges -->
              <div v-if="getGiteeUrl(repo.name)" class="flex gap-1 mt-1 scale-90 origin-right">
                 <img :src="`https://gitee.com/${giteeMap[repo.name]}/badge/star.svg?theme=dark`" alt="Gitee Star" />
                 <img :src="`https://gitee.com/${giteeMap[repo.name]}/badge/fork.svg?theme=dark`" alt="Gitee Fork" />
              </div>
            </div>
          </div>

          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
            {{ repo.name }}
          </h3>

          <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
            {{ repo.description || 'No description provided for this project.' }}
          </p>

          <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between font-mono text-gray-500">
             <div class="flex gap-6">
                <div class="flex flex-col">
                   <span class="text-[10px] uppercase tracking-wider opacity-60 mb-1">Github Stars</span>
                   <span class="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors flex items-center gap-1">
                      <StarIconSolid class="w-4 h-4 text-yellow-500" />
                      {{ repo.stargazers_count }}
                   </span>
                </div>
                <div class="flex flex-col">
                   <span class="text-[10px] uppercase tracking-wider opacity-60 mb-1">Github Forks</span>
                   <span class="text-lg font-bold text-white group-hover:text-neon-purple transition-colors flex items-center gap-1">
                      <svg class="w-4 h-4 text-neon-purple" fill="currentColor" viewBox="0 0 24 24"><path d="M15 5H18V8H15V5M15 15H18V18H15V15M5 5H8V8H5V5M11 5H13V19H11V5M5 15H8V18H5V15Z"/></svg>
                      {{ repo.forks_count }}
                   </span>
                </div>
             </div>
             
             <div class="flex flex-col items-end">
                <span class="text-[10px] uppercase tracking-wider opacity-60">Updated</span>
                <span class="text-xs text-gray-400">{{ new Date(repo.updated_at).toLocaleDateString() }}</span>
             </div>
          </div>
        </div>
      </a>
    </div>

    <!-- Loading Sentinel / Status -->
    <div ref="sentinelRef" v-show="!isInitialLoading" class="py-12 border-t border-gray-800/30 flex justify-center items-center flex-col gap-4">
      <!-- Append Loading State -->
      <div v-if="hasMore && (loading || isAppending)" class="w-full">
        <LoadingScanner :loading="true" text="Fetching next data cluster..." />
      </div>
      
      <!-- End of List -->
      <div v-if="!hasMore && !loading && displayedRepos.length > 0" class="flex flex-col items-center gap-2">
        <div class="flex gap-1">
          <div v-for="i in 3" :key="i" class="w-1 h-4 bg-neon-cyan/20"></div>
        </div>
        <div class="text-gray-600 font-mono text-xs uppercase tracking-[0.3em]">
          End of synchronized projects
        </div>
      </div>
    </div>

    <BackToTop />
  </div>
</template>

<style scoped>
.animation-delay-200 {
  animation-delay: 0.2s;
}
.animation-delay-400 {
  animation-delay: 0.4s;
}
</style>
