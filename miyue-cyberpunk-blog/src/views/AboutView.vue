<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { githubService, type GitHubUser, type GitHubRepo, type ContributionData } from '@/services/github';
import ContributionGraph from '@/components/core/ContributionGraph.vue';
import { ArrowTopRightOnSquareIcon, CodeBracketIcon, ShareIcon } from '@heroicons/vue/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/vue/20/solid';
import { techStack } from '@/data/techStack';

const user = ref<GitHubUser | null>(null);
const repos = ref<GitHubRepo[]>([]);
const contributions = ref<ContributionData | null>(null);
const loading = ref(true);

const giteeMap: Record<string, string> = {
  'bpmn-process-designer': 'miyuesc/bpmn-process-designer',
  'vite-vue-bpmn-process': 'miyuesc/vite-vue-bpmn-process',
  'vue-data-visualization': 'miyuesc/vue-data-visualization'
};

const getGiteeUrl = (repoName: string) => {
  return giteeMap[repoName] ? `https://gitee.com/${giteeMap[repoName]}` : null;
};

onMounted(async () => {
  try {
    const [userData, repoData, contribData] = await Promise.all([
      githubService.getUserProfile(),
      githubService.getUserRepos(),
      githubService.getContributions()
    ]);
    
    user.value = userData;
    repos.value = repoData.slice(0, 6); // Top 6 starred
    contributions.value = contribData;
  } catch (error) {
    console.error('Failed to load GitHub data', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-24 min-h-screen text-gray-300">
    <!-- Header / Profile -->
    <div class="flex flex-col md:flex-row gap-12 mb-20 items-center md:items-start" v-if="user || loading">
      <!-- Avatar -->
      <div class="relative shrink-0 group">
        <div class="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <img 
          :src="user?.avatar_url || 'https://github.com/miyuesc.png'" 
          alt="Avatar" 
          class="relative w-40 h-40 rounded-full border-2 border-black object-cover bg-gray-900"
        >
      </div>
      
      <!-- Bio -->
      <div class="text-center md:text-left space-y-4">
        <h1 class="text-5xl font-display font-bold text-white">
          Hi, I'm <span class="text-neon-cyan">{{ user?.name || 'MiyueFE' }}</span>.
        </h1>
        <p class="text-xl max-w-2xl text-gray-400 leading-relaxed">
          {{ user?.bio || 'Senior Front-end Engineer specializing in Visualization, BPMN engines, and Creative Coding.' }}
        </p>
        
        <!-- Personal Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-gray-400 border-l-2 border-neon-cyan/30 pl-4 py-2 bg-white/5 rounded-r">
           <div class="flex items-center gap-2">
             <span class="text-neon-cyan">Location:</span> 
             <span>{{ user?.location || 'Hangzhou, China' }}</span>
           </div>
           <div class="flex items-center gap-2">
             <span class="text-neon-cyan">Company:</span> 
             <span>{{ user?.company || 'Freelance' }}</span>
           </div>
           <div class="flex items-center gap-2">
             <span class="text-neon-cyan">Blog:</span> 
             <a :href="user?.blog" target="_blank" class="hover:text-white truncate max-w-[150px]">{{ user?.blog || 'miyuefe.com' }}</a>
           </div>
           <div class="flex items-center gap-2">
             <span class="text-neon-cyan">Email:</span> 
             <a href="mailto:miyuefe@qq.com" class="hover:text-white">miyuefe@qq.com</a>
           </div>
        </div>

        <div class="flex flex-wrap gap-4 justify-center md:justify-start">
          <a :href="user?.html_url" target="_blank" class="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-mono flex items-center gap-2 transition-all">
            <span class="w-2 h-2 rounded-full bg-matrix-green animate-pulse"></span>
            GitHub Profile
          </a>
          <a href="mailto:miyuefe@qq.com" class="px-6 py-2 border border-gray-700 hover:border-neon-purple rounded-lg text-gray-300 hover:text-white font-mono flex items-center gap-2 transition-all">
            Contact Me
          </a>
        </div>
      </div>
    </div>

    <!-- Tech Stack -->
    <section class="mb-20">
      <h2 class="text-2xl font-display text-white mb-8 flex items-center gap-3">
        <CodeBracketIcon class="w-6 h-6 text-neon-purple" />
        Tech Stack
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div 
          v-for="tech in techStack" 
          :key="tech.name" 
          class="p-4 bg-gray-800/40 rounded border border-gray-700/50 flex flex-col items-center gap-3 hover:bg-gray-800/80 transition-all cursor-default group"
          :style="{ borderColor: `${tech.color}40` }"
        >
          <!-- Masked Icon for Color Control -->
          <div 
            class="w-10 h-10 transition-all duration-300 group-hover:scale-110"
            :style="{ 
              backgroundColor: tech.color,
              maskImage: `url(${tech.icon})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url(${tech.icon})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center'
            }"
          ></div>
          <span 
            class="font-mono text-sm transition-colors"
            :style="{ color: tech.color }"
          >
            {{ tech.name }}
          </span>
        </div>
      </div>
    </section>

    <!-- Contribution Graph -->
    <section class="mb-20">
      <h2 class="text-2xl font-display text-white mb-8 flex items-center gap-3">
        <span class="w-3 h-3 bg-neon-cyan rotate-45"></span>
        Contribution Activity
      </h2>
      <div class="p-6 bg-cyber-black/40 border border-gray-800 rounded-xl backdrop-blur-sm">
        <ContributionGraph :data="contributions" :loading="loading" />
        <div class="flex justify-end items-center gap-2 mt-4 text-xs text-gray-500 font-mono">
          <span>Less</span>
          <div class="flex gap-1">
            <div class="w-3 h-3 rounded-[2px] bg-gray-800/30"></div>
            <div class="w-3 h-3 rounded-[2px] bg-cyan-900/40"></div>
            <div class="w-3 h-3 rounded-[2px] bg-cyan-700/60"></div>
            <div class="w-3 h-3 rounded-[2px] bg-neon-cyan/80"></div>
            <div class="w-3 h-3 rounded-[2px] bg-neon-cyan shadow-[0_0_5px_theme('colors.neon-cyan')]"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section>
      <h2 class="text-2xl font-display text-white mb-8 flex items-center gap-3">
        <StarIcon class="w-6 h-6 text-yellow-500" />
        Featured Projects
      </h2>
      
      <div v-if="loading" class="grid md:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="h-48 bg-gray-800/50 rounded animate-pulse"></div>
      </div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-2 gap-6 relative">
        <a 
          v-for="repo in repos" 
          :key="repo.id" 
          :href="repo.html_url" 
          target="_blank"
          class="project-card group block p-6 bg-white/5 border border-white/10 hover:border-neon-cyan/50 rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:-translate-y-2 relative overflow-hidden flex flex-col h-full shadow-lg"
        >
          <!-- Hover Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative z-10 flex flex-col h-full text-left">
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
            
            <p class="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
              {{ repo.description || 'No description provided.' }}
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
                      <span class="text-[10px] uppercase tracking-wider opacity-60 text-right">Updated</span>
                      <span class="text-xs text-gray-400">{{ new Date(repo.updated_at).toLocaleDateString() }}</span>
                   </div>
               </div>

               <!-- Footer Bottom: Metrics -->
               <div class="flex items-center justify-between">
                 <div class="flex gap-6">
                    <div class="flex flex-col">
                       <span class="text-[10px] uppercase tracking-wider opacity-60 mb-1">Stars</span>
                       <span class="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors flex items-center gap-1">
                          <StarIconSolid class="w-4 h-4 text-yellow-500" />
                          {{ repo.stargazers_count }}
                       </span>
                    </div>
                    <div class="flex flex-col">
                       <span class="text-[10px] uppercase tracking-wider opacity-60 mb-1">Forks</span>
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

      <!-- View All Projects Button -->
      <div class="mt-12 flex justify-center">
        <router-link 
          to="/projects"
          class="px-8 py-3 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 font-bold uppercase text-sm tracking-widest clip-path-button flex items-center gap-2"
        >
          View All Projects
          <ArrowTopRightOnSquareIcon class="w-4 h-4" />
        </router-link>
      </div>
    </section>
  </div>
</template>
