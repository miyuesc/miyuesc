<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Typed from 'typed.js';

const terminalRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (terminalRef.value) {
    new Typed(terminalRef.value, {
      strings: [
        '^1000[OK] Booting System...',
        '[OK] Loading User Profile: <span class="text-neon-cyan">MiyueFE</span>...',
        '[INFO] Role: <span class="text-neon-purple">Web Architect & Creative Coder</span>',
        '[INFO] Skills Loaded: <span class="text-yellow-400">Vue.js, React, Three.js, Node.js, WebGL</span>',
        '[INFO] Analyzing Projects...',
        '> <u>Cyberpunk Blog</u> [Initialized]',
        '> <u>Office Tools Series</u> [Active]',
        '[OK] Connecting to Neural Network...',
        '<span class="text-neon-cyan">[Success] Connection Established.</span>',
        'Contact: <a href="mailto:contact@miyuefe.com" class="underline hover:text-white">contact@miyuefe.com</a>',
        'GitHub: <a href="https://github.com/miyuesc" target="_blank" class="underline hover:text-white">@miyuesc</a>',
        'Welcome to the Cyberdeck. Initiate scroll to explore.',
      ],
      typeSpeed: 30,
      backSpeed: 0,
      loop: true,
      cursorChar: '█',
      showCursor: true,
      contentType: 'html',
    });
  }
});
</script>

<template>
  <div class="font-mono text-matrix-green text-sm md:text-base leading-relaxed p-6 bg-black/80 border border-matrix-green/30 rounded backdrop-blur-sm shadow-neon-box max-w-lg w-full">
    <div class="flex items-center gap-2 mb-4 border-b border-matrix-green/20 pb-2">
      <div class="w-3 h-3 rounded-full bg-alert-red"></div>
      <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div class="w-3 h-3 rounded-full bg-matrix-green"></div>
      <span class="ml-auto text-xs opacity-50">root@miyue-cyberdeck:~</span>
    </div>
    <div class="min-h-[150px]">
      <span ref="terminalRef"></span>
    </div>
  </div>
</template>

<style scoped>
.shadow-neon-box {
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
}
</style>
