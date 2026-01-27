<script setup lang="ts">
defineProps<{
  loading?: boolean;
  text?: string;
}>();
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-4">
      <div class="relative w-16 h-16">
        <!-- Inner Ring -->
        <div class="absolute inset-0 border-2 border-neon-cyan/20 rounded-full"></div>
        <!-- Scanning Spinner -->
        <div class="absolute inset-0 border-t-2 border-neon-cyan rounded-full animate-spin"></div>
        <!-- Pulse Center -->
        <div class="absolute inset-4 bg-neon-cyan/10 rounded-full animate-pulse blur-sm"></div>
      </div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-neon-cyan font-mono text-xs tracking-[0.2em] uppercase animate-pulse">
          {{ text || 'Initializing System...' }}
        </span>
        <div class="w-32 h-[1px] bg-gray-800 relative overflow-hidden">
          <div class="absolute inset-0 bg-neon-cyan animate-loading-bar"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes loading-bar {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.animate-loading-bar {
  animation: loading-bar 2s infinite ease-in-out;
}
</style>
