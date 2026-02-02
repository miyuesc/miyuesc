<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}>();

const emit = defineEmits(['page-change']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

const visiblePages = computed(() => {
  const pages: number[] = [];
  const delta = 2; // Number of pages to show on each side
  const left = Math.max(1, props.currentPage - delta);
  const right = Math.min(totalPages.value, props.currentPage + delta);

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }
  return pages;
});

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col items-center gap-4 mt-12 font-mono select-none animate-fade-in-up">
    <div class="flex flex-wrap justify-center items-center gap-2">
      <!-- Prev -->
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="group px-4 py-2 border border-gray-800 bg-black/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-800 transition-all clip-path-button"
      >
        <span class="group-hover:-translate-x-1 transition-transform inline-block">[&lt; PREV]</span>
      </button>

      <!-- First Page Access (if far) -->
      <button 
        v-if="visiblePages[0] > 1"
        @click="changePage(1)"
        class="w-10 h-10 border border-gray-800 bg-black/40 text-gray-500 hover:border-gray-600 hover:text-gray-300 flex items-center justify-center transition-all clip-path-box"
      >
        1
      </button>
      <span v-if="visiblePages[0] > 2" class="text-gray-600">...</span>

      <!-- Pages -->
      <div class="flex gap-2">
          <button 
              v-for="p in visiblePages" 
              :key="p"
              @click="changePage(p)"
              :class="[
                  'w-10 h-10 border flex items-center justify-center transition-all clip-path-box relative overflow-hidden',
                  currentPage === p 
                      ? 'border-neon-cyan text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                      : 'border-gray-800 bg-black/40 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              ]"
          >
              <div v-if="currentPage === p" class="absolute inset-0 bg-neon-cyan/20"></div>
              <span class="relative z-10">{{ p }}</span>
          </button>
      </div>

      <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="text-gray-600">...</span>
      <!-- Last Page Access (if far) -->
      <button 
        v-if="visiblePages[visiblePages.length - 1] < totalPages"
        @click="changePage(totalPages)"
        class="w-10 h-10 border border-gray-800 bg-black/40 text-gray-500 hover:border-gray-600 hover:text-gray-300 flex items-center justify-center transition-all clip-path-box"
      >
        {{ totalPages }}
      </button>

      <!-- Next -->
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="group px-4 py-2 border border-gray-800 bg-black/40 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-800 transition-all clip-path-button"
      >
        <span class="group-hover:translate-x-1 transition-transform inline-block">[NEXT &gt;]</span>
      </button>
    </div>

    <div class="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
        <span class="w-2 h-2 bg-neon-cyan/50 rounded-full animate-pulse"></span>
        PAGE_INDEX: [{{ currentPage.toString().padStart(2, '0') }} / {{ totalPages.toString().padStart(2, '0') }}]
    </div>
  </div>
</template>

<style scoped>
.clip-path-button {
  clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
}
.clip-path-box {
    clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);
}
.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
