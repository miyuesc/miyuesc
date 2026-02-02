<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { githubService, type GitHubRepo } from '@/services/github';
import { CodeBracketIcon, ArrowPathIcon, ShareIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/20/solid';
import LoadingScanner from '@/components/core/LoadingScanner.vue';
import BackToTop from '@/components/core/BackToTop.vue';
import Pagination from '@/components/common/Pagination.vue';
import gsap from 'gsap';

const allRepos = ref<GitHubRepo[]>([]);
const loading = ref(true);
const isInitialLoading = ref(true);
const sortBy = ref<'stars' | 'date'>('stars');
const page = ref(1);
const itemsPerPage = 12;

// Gitee Mapping based on README
const giteeMap: Record<string, string> = {
  'bpmn-process-designer': 'miyuesc/bpmn-process-designer',
  'vite-vue-bpmn-process': 'miyuesc/vite-vue-bpmn-process',
  'vue-data-visualization': 'miyuesc/vue-data-visualization'
};

const getGiteeUrl = (repoName: string) => {
  return giteeMap[repoName] ? `https://gitee.com/${giteeMap[repoName]}` : null;
};

// Computed Sorted Repos
const sortedRepos = computed(() => {
  return [...allRepos.value].sort((a, b) => {
    if (sortBy.value === 'stars') {
      return b.stargazers_count - a.stargazers_count;
    } else {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });
});

// Computed Paginated Repos
const displayedRepos = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedRepos.value.slice(start, end);
});

const totalItems = computed(() => allRepos.value.length);

// Fetch Data
const fetchData = async () => {
  loading.value = true;
  try {
    const cached = sessionStorage.getItem('miyue_blog_repos');
    if (cached) {
      allRepos.value = JSON.parse(cached);
    } else {
      const repos = await githubService.getUserRepos();
      allRepos.value = repos;
      sessionStorage.setItem('miyue_blog_repos', JSON.stringify(repos));
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
    isInitialLoading.value = false;
    nextTick(animateItems);
  }
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
};

// Watch sort change to reset page
watch(sortBy, () => {
  page.value = 1;
});

// Watch displayed items for animation
watch(displayedRepos, () => {
  nextTick(animateItems);
});

const animateItems = () => {
  const items = document.querySelectorAll('.project-card');
  if (items.length === 0) return;
  
  // Reset for animation
  // Explicitly animate from invisible to visible
  gsap.fromTo(items, 
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'transform' // Clear transform props to avoid interfering with CSS hover effects
    }
  );
};

// Toggle Sort
const toggleSort = () => {
  sortBy.value = sortBy.value === 'stars' ? 'date' : 'stars';
};

onMounted(async () => {
  await fetchData();
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
    <div v-else class="flex flex-col gap-8">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a 
          v-for="repo in displayedRepos" 
          :key="repo.id" 
          :href="repo.html_url" 
          target="_blank"
          class="project-card group p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full shadow-lg"
          :class="repo.fork ? 'hover:border-neon-purple/50' : 'hover:border-neon-cyan/50'"
        >
          <!-- Hover Gradient -->
          <div 
            class="absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :class="repo.fork ? 'from-neon-purple/10' : 'from-neon-cyan/10'"
          ></div>

          <div class="relative z-10 flex flex-col h-full">
            <div class="flex justify-between items-start mb-4">
              <div 
                class="p-2 bg-gray-900/50 rounded-lg transition-colors border border-white/10 shrink-0"
                :class="repo.fork ? 'group-hover:bg-neon-purple/20' : 'group-hover:bg-neon-cyan/20'"
              >
                <ShareIcon v-if="repo.fork" class="w-6 h-6" :class="repo.fork ? 'text-neon-purple' : 'text-neon-cyan'" />
                <CodeBracketIcon v-else class="w-6 h-6 text-neon-cyan" />
              </div>
              
              <div class="flex flex-col items-end gap-1 flex-1 min-w-0 ml-2">
                 <div class="flex items-center gap-2 mb-1">
                    <!-- Fork Label -->
                   <span v-if="repo.fork" class="text-[10px] font-mono text-neon-purple bg-neon-purple/10 border border-neon-purple/20 px-1.5 py-0.5 rounded tracking-wider">
                      FORKED
                   </span>
                 </div>

                 <div class="flex gap-1 flex-wrap justify-end">
                    <span class="text-xs font-mono text-gray-400 bg-black/40 px-2 py-1 rounded border border-white/5 whitespace-nowrap">
                      {{ repo.language || 'Code' }}
                    </span>
                 </div>

                <!-- Gitee Badges -->
                <div v-if="getGiteeUrl(repo.name)" class="flex gap-1 mt-1 scale-90 origin-right">
                   <img :src="`https://gitee.com/${giteeMap[repo.name]}/badge/star.svg?theme=dark`" alt="Gitee Star" />
                   <img :src="`https://gitee.com/${giteeMap[repo.name]}/badge/fork.svg?theme=dark`" alt="Gitee Fork" />
                </div>
              </div>
            </div>

            <h3 
              class="text-xl font-bold text-white mb-2 transition-colors break-words"
              :class="repo.fork ? 'group-hover:text-neon-purple' : 'group-hover:text-neon-cyan'"
            >
              {{ repo.name }}
            </h3>

            <p class="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
              {{ repo.description || 'No description provided for this project.' }}
            </p>

            <div class="mt-auto pt-4 border-t border-white/5 flex flex-col gap-4 font-mono text-gray-500">
               <!-- Footer Top: Stats & Action -->
               <div class="flex items-center justify-between">
                  <div class="flex gap-4">
                      <!-- Live Demo (Moved here) -->
                      <a 
                         v-if="repo.homepage" 
                         :href="repo.homepage" 
                         target="_blank" 
                         @click.stop
                         class="flex items-center gap-1 text-[10px] font-bold text-neon-cyan bg-neon-cyan/5 border border-neon-cyan/20 px-2 py-1 rounded hover:bg-neon-cyan hover:text-black transition-colors"
                       >
                          LIVE_DEMO <ArrowTopRightOnSquareIcon class="w-3 h-3" />
                       </a>
                  </div>

                  <div class="flex flex-col items-end">
                      <span class="text-[10px] uppercase tracking-wider opacity-60">Updated</span>
                      <span class="text-xs text-gray-400">{{ new Date(repo.updated_at).toLocaleDateString() }}</span>
                   </div>
               </div>

               <!-- Footer Bottom: Metrics -->
               <div class="flex items-center justify-between">
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
               </div>
            </div>
          </div>
        </a>
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

<style scoped>
.animation-delay-200 {
  animation-delay: 0.2s;
}
.animation-delay-400 {
  animation-delay: 0.4s;
}
</style>
