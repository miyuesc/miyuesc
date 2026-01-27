<script setup lang="ts">
import { ref } from 'vue';
import AnimatedBackground from '@/components/core/AnimatedBackground.vue';
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'; // Assuming heroicons available

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <main class="relative w-full min-h-screen font-sans">
    <!-- Background Layer -->
    <AnimatedBackground />

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-cyber-black/90 backdrop-blur-md border-b border-gray-800">
      <router-link to="/" class="text-xl font-display font-bold tracking-tighter text-white hover:text-neon-cyan transition-colors z-50">
        MIYUE<span class="text-neon-cyan">.FE</span>
      </router-link>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex gap-6 text-sm font-mono">
        <router-link to="/" class="text-gray-400 hover:text-neon-cyan transition-colors" active-class="text-neon-cyan">
          [~/HOME]
        </router-link>
        <router-link to="/posts" class="text-gray-400 hover:text-neon-cyan transition-colors" active-class="text-neon-cyan">
          [./POSTS]
        </router-link>
        <router-link to="/projects" class="text-gray-400 hover:text-neon-cyan transition-colors" active-class="text-neon-cyan">
          [./PROJECTS]
        </router-link>
        <router-link to="/about" class="text-gray-400 hover:text-neon-cyan transition-colors" active-class="text-neon-cyan">
          [./ABOUT]
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="md:hidden text-white hover:text-neon-cyan transition-colors relative z-50 w-8 h-8 flex items-center justify-center">
        <Bars3Icon v-if="!isMobileMenuOpen" class="w-8 h-8" />
        <XMarkIcon v-else class="w-8 h-8" />
      </button>
    </nav>

    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-cyber-black/95 z-40 flex flex-col items-center justify-center gap-8 font-mono text-xl backdrop-blur-xl" @click.self="closeMobileMenu">
        <router-link to="/" @click="closeMobileMenu" class="text-gray-300 hover:text-neon-cyan hover:scale-110 transition-all border-b border-transparent hover:border-neon-cyan pb-1">
          [~/HOME]
        </router-link>
        <router-link to="/posts" @click="closeMobileMenu" class="text-gray-300 hover:text-neon-cyan hover:scale-110 transition-all border-b border-transparent hover:border-neon-cyan pb-1">
          [./POSTS]
        </router-link>
        <router-link to="/projects" @click="closeMobileMenu" class="text-gray-300 hover:text-neon-cyan hover:scale-110 transition-all border-b border-transparent hover:border-neon-cyan pb-1">
          [./PROJECTS]
        </router-link>
        <router-link to="/about" @click="closeMobileMenu" class="text-gray-300 hover:text-neon-cyan hover:scale-110 transition-all border-b border-transparent hover:border-neon-cyan pb-1">
          [./ABOUT]
        </router-link>
      </div>
    </transition>

    <!-- Content Layer -->
    <div class="relative z-10 w-full pt-16">
      <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
      </router-view>
    </div>
  </main>
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

<style lang="scss">
.glitch-effect {
  text-shadow: 2px 2px 0px theme('colors.alert-red'), -2px -2px 0px theme('colors.neon-purple');
  animation: glitch 1s infinite alternate;
}

@keyframes glitch {
  0% { transform: translate(0) }
  20% { transform: translate(-2px, 2px) }
  40% { transform: translate(-2px, -2px) }
  60% { transform: translate(2px, 2px) }
  80% { transform: translate(2px, -2px) }
  100% { transform: translate(0) }
}
</style>
