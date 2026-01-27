<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ContributionData } from '@/services/github';

const props = defineProps<{
  data: ContributionData | null;
  loading: boolean;
}>();

// Tooltip State
const hoveredDay = ref<{ count: number; date: string } | null>(null);
const tooltipPos = ref({ x: 0, y: 0 });

const handleMouseEnter = (event: MouseEvent, day: { count: number; date: string }) => {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  hoveredDay.value = day;
  tooltipPos.value = {
    x: rect.left + rect.width / 2,
    y: rect.top - 10 // Offset upward
  };
};

const handleMouseLeave = () => {
  hoveredDay.value = null;
};

const weeks = computed(() => {
  if (!props.data) return [];
  const contributions = props.data.contributions;
  const weeksArray = [];
  let currentWeek = [];
  
  for (const day of contributions) {
    currentWeek.push(day);
    if (new Date(day.date).getDay() === 6) { // Saturday
      weeksArray.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeksArray.push(currentWeek);
  
  return weeksArray;
});

// const flatContributions = computed(() => props.data?.contributions || []);

const getColor = (level: number) => {
  switch (level) {
    case 0: return 'bg-gray-800/30';
    case 1: return 'bg-cyan-900/40';
    case 2: return 'bg-cyan-700/60';
    case 3: return 'bg-neon-cyan/80';
    case 4: return 'bg-neon-cyan shadow-[0_0_10px_theme("colors.neon-cyan")]';
    default: return 'bg-gray-800/30';
  }
};
</script>

<template>
  <div class="relative w-full overflow-hidden bg-cyber-black/20 rounded-lg p-4 border border-gray-800/50">
    <!-- Scanline Background Effect -->
    <div class="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>
    
    <div class="w-full overflow-x-auto pb-2 custom-scrollbar flex justify-center">
      <div v-if="loading" class="flex gap-1 animate-pulse">
        <div v-for="i in 50" :key="i" class="w-3 h-3 bg-gray-800/50 rounded-sm"></div>
      </div>
      
      <div v-else class="flex gap-[3px] min-w-max">
        <!-- We render columns (weeks) -->
        <div v-for="(week, wIndex) in weeks" :key="wIndex" class="flex flex-col gap-[3px]">
          <div 
            v-for="day in week" 
            :key="day.date"
            class="w-[10px] h-[10px] rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-10 cursor-pointer relative"
            :class="getColor(day.level)"
            @mouseenter="handleMouseEnter($event, day)"
            @mouseleave="handleMouseLeave"
          >
          </div>
        </div>
      </div>
    </div>

    <!-- Teleported Tooltip to avoid overflow clipping -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="hoveredDay"
          class="fixed z-[9999] px-2 py-1 bg-black border border-neon-cyan/30 text-[10px] text-white whitespace-nowrap rounded shadow-neon pointer-events-none transform -translate-x-1/2 -translate-y-full"
          :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
        >
          {{ hoveredDay.count }} contributions on {{ hoveredDay.date }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -90%);
}

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: theme('colors.gray.800');
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.bg-scanline {
  background: linear-gradient(
    to bottom,
    transparent 50%,
    theme('colors.neon-cyan') 50%
  );
  background-size: 100% 4px;
}
</style>
