<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowUpIcon } from '@heroicons/vue/24/solid';

const isVisible = ref(false);

const handleScroll = () => {
  requestAnimationFrame(() => {
    isVisible.value = window.scrollY > 300;
  });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <transition name="fade">
    <button 
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 p-4 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black rounded-full shadow-neon backdrop-blur transition-all duration-300 group"
    >
      <ArrowUpIcon class="w-6 h-6 group-hover:animate-bounce" />
    </button>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
