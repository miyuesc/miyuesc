<script setup lang="ts">
import Terminal from './Terminal.vue';
import KeyboardBackground from './KeyboardBackground.vue';
</script>

<template>
  <section class="relative w-full h-screen flex items-center justify-center overflow-hidden">
    <!-- 3D Background Layer -->
    <KeyboardBackground />

    <!-- Content Layer -->
    <div class="relative z-10 container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 pointer-events-none">
      <!-- Left: Title & Slogan -->
      <div class="text-left space-y-6 pointer-events-auto">
        <h1 class="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
          <span class="text-neon-cyan">MIYUE</span>.FE
        </h1>
        <p class="text-xl md:text-2xl text-gray-400 max-w-lg">
          Web Architect & Creative Coder
        </p>
        <div class="h-1 w-20 bg-alert-red"></div>
        <div class="flex gap-4">
          <router-link to="/projects" class="px-6 py-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all duration-300 font-bold uppercase text-sm tracking-widest clip-path-button inline-block text-center">
            View Projects
          </router-link>
          <router-link to="/about" class="px-6 py-2 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all duration-300 font-bold uppercase text-sm tracking-widest clip-path-button inline-block text-center">
            Contact
          </router-link>
        </div>
      </div>

      <!-- Right: Terminal -->
      <div class="w-full md:w-auto pointer-events-auto">
        <Terminal />
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none opacity-50">
      <div class="flex flex-col items-center gap-2 animate-bounce">
        <span class="text-xs uppercase tracking-widest text-center whitespace-nowrap">Scroll to Initiate</span>
        <div class="w-[1px] h-10 bg-gradient-to-b from-neon-cyan to-transparent"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.clip-path-button {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}
</style>
