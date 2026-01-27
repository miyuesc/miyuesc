<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { githubService } from '@/services/github';
import LoadingScanner from '@/components/core/LoadingScanner.vue';
import BackToTop from '@/components/core/BackToTop.vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.css';
import { ListBulletIcon, XMarkIcon } from '@heroicons/vue/24/outline'; // TOC Icons

const route = useRoute();
const content = ref('');
const loading = ref(true);
const title = ref('');
const toc = ref<{ level: number, text: string, id: string }[]>([]);
const isMobileTocOpen = ref(false);

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

// 自定义渲染规则：为标题添加 ID
md.renderer.rules.heading_open = (tokens, idx, options, _env, self) => {
  const token = tokens[idx];
  const textToken = tokens[idx + 1];
  if (textToken && textToken.type === 'inline') {
    const id = textToken.content.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
    token.attrSet('id', id);
  }
  return self.renderToken(tokens, idx, options);
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert('Link compiled to clipboard.');
};

const openInGitHub = () => {
  const path = route.params.path as string;
  window.open(`https://github.com/miyuesc/blog/blob/main/${path}`, '_blank');
};

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const offset = 100; // 考虑固定导航栏的高度
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    isMobileTocOpen.value = false; // Close mobile TOC on click
  }
};

onMounted(async () => {
  const path = route.params.path as string;
  title.value = decodeURIComponent(path).split('/').pop()?.replace('.md', '') || '';
  
  try {
    const rawContent = await githubService.getPostContent(path);
    
    // 提取目录
    const headingLines = rawContent.match(/^#{1,4}\s+.+$/gm) || [];
    toc.value = headingLines.map(line => {
      const level = (line.match(/^#+/) || [''])[0].length;
      const text = line.replace(/^#+\s+/, '');
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
      return { level, text, id };
    });

    content.value = md.render(rawContent);
  } catch (err) {
    console.error(err);
    content.value = '<div class="text-alert-red font-mono">ERROR: ARCHIVE CORRUPTED OR ACCESS DENIED.</div>';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-cyber-black text-gray-300 relative">
    <div v-if="loading" class="h-screen flex items-center justify-center">
      <LoadingScanner :loading="true" text="Decoding Archive Data..." />
    </div>

    <div v-else class="container mx-auto px-4 py-20 flex flex-col lg:flex-row gap-8 lg:gap-12">
      
      <!-- Mobile TOC Toggle -->
      <button 
        @click="isMobileTocOpen = !isMobileTocOpen"
        class="lg:hidden fixed bottom-6 left-6 z-40 bg-cyber-black border border-neon-cyan text-neon-cyan p-3 rounded-full shadow-neon-box backdrop-blur-md"
      >
        <ListBulletIcon v-if="!isMobileTocOpen" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
      </button>

      <!-- Sidebar/TOC (Desktop: Sticky; Mobile: Fixed Overlay) -->
      <aside 
        class="lg:w-64 shrink-0 transition-transform duration-300 z-30"
        :class="[
          isMobileTocOpen ? 'fixed inset-0 bg-cyber-black/95 backdrop-blur-xl p-6 pt-24 translate-x-0' : 'fixed inset-0 translate-x-full lg:static lg:translate-x-0 lg:bg-transparent lg:p-0'
        ]"
      >
        <!-- Inner container: Mobile needs full height scroll, Desktop needs sticky -->
        <div class="flex flex-col gap-6 h-full lg:h-auto lg:sticky lg:top-28 lg:max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
          <!-- TOC Section -->
          <div class="flex-1 min-h-0 p-6 bg-white/5 border border-white/10 rounded-lg flex flex-col shrink-0">
            <h4 class="text-xs font-mono text-neon-cyan uppercase tracking-widest mb-4 shrink-0">On This Page</h4>
            <div v-if="toc.length"
                class="text-sm font-mono space-y-4 pr-2">
              <div 
                v-for="item in toc" 
                :key="item.id"
                @click="scrollToHeading(item.id)"
                class="hover:text-neon-cyan cursor-pointer transition-all border-l-2 border-transparent hover:border-neon-cyan pl-3 group relative py-0.5"
                :style="{ 
                  paddingLeft: `${(item.level - 1) * 10 + 12}px`,
                  opacity: 1 - (item.level - 1) * 0.2,
                  fontSize: `${14 - (item.level - 1) * 1}px`
                }"
              >
                <!-- Hierarchy Indicator -->
                <span v-if="item.level > 1" class="absolute left-0 top-1/2 -translate-y-1/2 text-neon-cyan font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                  {{ '└' }}
                </span>
                <span class="line-clamp-2 leading-snug">
                  {{ item.text }}
                </span>
              </div>
            </div>
            <div v-else class="text-xs font-mono text-gray-600">No headings detected.</div>
          </div>
          
          <!-- Share Section -->
          <div class="p-6 bg-white/5 border border-white/10 rounded-lg shrink-0">
            <h4 class="text-xs font-mono text-neon-cyan uppercase tracking-widest mb-4">Share Archive</h4>
            <div class="flex gap-4">
              <button 
                @click="copyLink"
                title="Copy Link"
                class="p-2 border border-gray-700 hover:border-neon-cyan hover:text-neon-cyan transition-all rounded bg-gray-900/50"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              </button>
              <button 
                @click="openInGitHub"
                title="View on GitHub"
                class="p-2 border border-gray-700 hover:border-neon-cyan hover:text-neon-cyan transition-all rounded bg-gray-900/50"
              >
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.161 22 16.415 22 12c0-5.523-4.477-10-10-10z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <article class="flex-1 w-full max-w-4xl prose prose-invert prose-neon mx-auto break-words overflow-x-hidden">
        <header class="mb-12">
          <div class="flex items-center gap-2 text-xs font-mono text-neon-cyan mb-4">
             <span class="px-2 py-0.5 border border-neon-cyan/50 rounded">RAW_DATA</span>
             <span>Deciphered at 2024.01.26</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter leading-tight">
            {{ title }}
          </h1>
        </header>

        <div v-html="content" class="markdown-body"></div>
      </article>
    </div>
    
    <BackToTop />
  </div>
</template>

<style lang="scss">
.markdown-body {
  line-height: 1.8;
  font-family: inherit;
  
  h1, h2, h3, h4 {
    color: white;
    font-family: theme('fontFamily.display');
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    
    &::before {
      content: '# ';
      color: theme('colors.neon-cyan');
      opacity: 0.5;
    }
  }

  p {
    margin-bottom: 1.5rem;
    color: theme('colors.gray.400');
  }

  a {
    color: theme('colors.neon-cyan');
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s;
    
    &:hover {
      border-color: theme('colors.neon-cyan');
      text-shadow: 0 0 5px theme('colors.neon-cyan');
    }
  }

  pre {
    background: theme('colors.gray.900') !important;
    padding: 1.5rem;
    border: 1px solid theme('colors.white / 10%');
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 2rem 0;
    
    code {
      background: transparent;
      padding: 0;
      color: theme('colors.gray.300');
      font-size: 0.9rem;
    }
  }

  code:not(pre code) {
    background: theme('colors.white / 10%');
    color: theme('colors.neon-cyan');
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.85em;
  }

  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    color: theme('colors.gray.400');
    
    li {
      margin-bottom: 0.5rem;
    }
  }

  blockquote {
    border-left: 4px solid theme('colors.neon-cyan');
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: theme('colors.gray.500');
  }

  img {
    max-width: 100%;
    border-radius: 0.75rem;
    border: 1px solid theme('colors.white / 10%');
    margin: 2rem 0;
  }
}
</style>
