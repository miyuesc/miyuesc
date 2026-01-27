<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HeroSection from '@/components/core/HeroSection.vue';
import { githubService, type PostMeta, type GitHubRepo } from '@/services/github';
import { CodeBracketIcon, BoltIcon, StarIcon } from '@heroicons/vue/24/outline';

const recentPosts = ref<PostMeta[]>([]);
const topProjects = ref<any[]>([]);

onMounted(async () => {
  try {
    // Parallel Fetch
    const [posts, repos] = await Promise.all([
      githubService.getPosts(),
      githubService.getUserRepos()
    ]);

    // Process Posts
    recentPosts.value = posts.slice(0, 5);

    // Process Projects (Top 3 by Stars)
    topProjects.value = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map(repo => ({
        title: repo.name,
        description: repo.description || 'No description provided.',
        tech: [repo.language || 'Code'], 
        stars: repo.stargazers_count,
        status: 'Public',
        url: repo.html_url
      }));

  } catch (error) {
    console.error('Failed to fetch home data:', error);
  }
});
</script>

<template>
  <div class="relative w-full">
    <HeroSection />

    <div class="container mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
      
      <!-- Section 1: Top Priority Projects -->
      <div>
        <h2 class="text-2xl font-display text-neon-cyan mb-8 border-b border-gray-800 pb-2 flex items-center gap-2">
          <BoltIcon class="w-6 h-6" />
          <span>PRIORITY_PROJECTS</span>
        </h2>
        
        <div class="space-y-6">
          <a v-for="(project, i) in topProjects" :key="i" :href="project.url" target="_blank" class="group block p-6 border border-gray-800 bg-cyber-black/80 hover:border-neon-cyan/50 transition-all rounded backdrop-blur-sm relative overflow-hidden">
             <div class="absolute top-0 right-0 p-2 opacity-50 text-[10px] font-mono border-l border-b border-gray-800 text-neon-cyan">
               STATUS: {{ project.status }}
             </div>
             
             <h3 class="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors mb-2">
               {{ project.title }}
             </h3>
             <p class="text-gray-400 text-sm mb-4 line-clamp-2">
               {{ project.description }}
             </p>
             
             <div class="flex flex-wrap gap-2 mb-3">
               <span v-for="t in project.tech" :key="t" class="px-2 py-1 text-[10px] bg-gray-900 border border-gray-700 rounded text-gray-300">
                 {{ t }}
               </span>
             </div>
             
             <div class="flex items-center gap-1 text-xs text-yellow-500 font-mono">
               <StarIcon class="w-3 h-3" /> {{ project.stars }}
             </div>
          </a>
          
          <div v-if="topProjects.length === 0" class="text-gray-600 font-mono text-sm">
             [SYSTEM] Scanning project database...
          </div>
        </div>
        
        <div class="mt-8 text-right">
           <router-link to="/projects" class="text-sm font-mono text-neon-cyan hover:underline hover:text-white transition-colors">
             [VIEW_ALL_PROJECTS] ->
           </router-link>
        </div>
      </div>

      <!-- Section 2: Recent Articles -->
      <div>
        <h2 class="text-2xl font-display text-neon-purple mb-8 border-b border-gray-800 pb-2 flex items-center gap-2">
          <CodeBracketIcon class="w-6 h-6" />
          <span>RECENT_LOGS</span>
        </h2>
        
        <div class="space-y-4">
          <router-link 
            v-for="post in recentPosts" 
            :key="post.sha" 
            :to="`/posts/${encodeURIComponent(post.path)}`"
            class="block p-4 border-l-2 border-gray-800 hover:border-neon-purple bg-cyber-black/40 hover:bg-white/5 transition-all group"
          >
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-mono text-gray-500 group-hover:text-neon-cyan">{{ post.date }}</span>
              <span class="text-[10px] uppercase tracking-widest text-neon-purple/70 group-hover:text-neon-purple">LOG_ENTRY</span>
            </div>
            <h3 class="text-lg font-bold text-gray-200 group-hover:text-white">
              {{ post.title }}
            </h3>
          </router-link>

          <div v-if="recentPosts.length === 0" class="text-gray-600 font-mono text-sm py-4">
             [SYSTEM] Scanning archives...
          </div>
        </div>
        
         <div class="mt-8 text-right">
           <router-link to="/posts" class="text-sm font-mono text-neon-purple hover:underline hover:text-white transition-colors">
             [ACCESS_ARCHIVES] ->
           </router-link>
        </div>
      </div>
      
    </div>
  </div>
</template>
