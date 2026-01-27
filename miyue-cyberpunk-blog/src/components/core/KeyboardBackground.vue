<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface KeyConfig {
  id: string;
  label: string;
  width?: number; // relative width unit (1 = standard key)
  active: boolean;
  delay: number;
}

const keyboardLayout = [
  // Row 1
  [
    { label: 'ESC', width: 1 }, { label: 'F1', width: 1 }, { label: 'F2', width: 1 }, { label: 'F3', width: 1 }, 
    { label: 'F4', width: 1 }, { label: 'F5', width: 1 }, { label: 'F6', width: 1 }, { label: 'F7', width: 1 }, 
    { label: 'F8', width: 1 }, { label: 'F9', width: 1 }, { label: 'F10', width: 1 }, { label: 'F11', width: 1 }, { label: 'F12', width: 1 }
  ],
  // Row 2
  [
    { label: '`', width: 1 }, { label: '1', width: 1 }, { label: '2', width: 1 }, { label: '3', width: 1 }, 
    { label: '4', width: 1 }, { label: '5', width: 1 }, { label: '6', width: 1 }, { label: '7', width: 1 }, 
    { label: '8', width: 1 }, { label: '9', width: 1 }, { label: '0', width: 1 }, { label: '-', width: 1 }, 
    { label: '=', width: 1 }, { label: 'DEL', width: 1.5 }
  ],
  // Row 3
  [
    { label: 'TAB', width: 1.5 }, { label: 'Q', width: 1 }, { label: 'W', width: 1 }, { label: 'E', width: 1 }, 
    { label: 'R', width: 1 }, { label: 'T', width: 1 }, { label: 'Y', width: 1 }, { label: 'U', width: 1 }, 
    { label: 'I', width: 1 }, { label: 'O', width: 1 }, { label: 'P', width: 1 }, { label: '[', width: 1 }, 
    { label: ']', width: 1 }, { label: '\\', width: 1 }
  ],
  // Row 4
  [
    { label: 'MPS', width: 1.75 }, { label: 'A', width: 1 }, { label: 'S', width: 1 }, { label: 'D', width: 1 }, 
    { label: 'F', width: 1 }, { label: 'G', width: 1 }, { label: 'H', width: 1 }, { label: 'J', width: 1 }, 
    { label: 'K', width: 1 }, { label: 'L', width: 1 }, { label: ';', width: 1 }, { label: "'", width: 1 }, 
    { label: 'ENT', width: 1.8 }
  ],
  // Row 5
  [
    { label: 'SFT', width: 2.25 }, { label: 'Z', width: 1 }, { label: 'X', width: 1 }, { label: 'C', width: 1 }, 
    { label: 'V', width: 1 }, { label: 'B', width: 1 }, { label: 'N', width: 1 }, { label: 'M', width: 1 }, 
    { label: ',', width: 1 }, { label: '.', width: 1 }, { label: '/', width: 1 }, { label: 'SFT', width: 2.25 }
  ],
  // Row 6
  [
    { label: 'CTRL', width: 1.5 }, { label: 'CMD', width: 1.25 }, { label: 'ALT', width: 1.25 }, 
    { label: '', width: 6.25 }, // Space
    { label: 'ALT', width: 1.25 }, { label: 'FN', width: 1.25 }, { label: 'CTRL', width: 1.5 }
  ]
];

const rows = ref<{ id: number; keys: KeyConfig[] }[]>([]);
let intervalId: number;

const initKeys = () => {
  rows.value = keyboardLayout.map((rowConfig, rIndex) => ({
    id: rIndex,
    keys: rowConfig.map((keyConfig, kIndex) => ({
      ...keyConfig,
      id: `${rIndex}-${kIndex}-${keyConfig.label}`,
      active: false,
      delay: Math.random() * 2
    }))
  }));
};

const activateRandomKey = () => {
  const randomRow = Math.floor(Math.random() * rows.value.length);
  const randomKey = Math.floor(Math.random() * rows.value[randomRow].keys.length);
  const key = rows.value[randomRow].keys[randomKey];
  
  if (key) {
    key.active = true;
    setTimeout(() => {
        if(key) key.active = false;
    }, 400 + Math.random() * 600);
  }
};

const handleHover = (rIndex: number, kIndex: number) => {
  const key = rows.value[rIndex].keys[kIndex];
  if (key) {
    key.active = true;
    setTimeout(() => {
      if(key) key.active = false;
    }, 300);
  }
};

onMounted(() => {
  initKeys();
  intervalId = setInterval(activateRandomKey, 150) as unknown as number;
});

const getRowPadding = (rIndex: number): number => {
  // Staggering logic: 
  // Row 0 (F-keys): 0
  // Row 1 (Numbers): 0
  // Row 2 (QWERTY): 20
  // Row 3 (ASDF): 30
  // Row 4 await (ZXCV): 10 or complex.
  // Standard keyboard stagger is usually:
  // Tab row: +1.5u (handled by key width) -> No, stagger is physical.
  // Actually, standard layout has keys aligned. The "Stagger" is internal.
  // But for visual simplifiction, let's just push rows a bit.
  const baseOffset = 20;
  return [0, 0, 20, 30, 40, 10][rIndex] || 0;
};

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="keyboard-container absolute inset-0 overflow-hidden flex items-center justify-center bg-cyber-black">
    <div class="keyboard-grid">
      <div 
        v-for="(row, rIndex) in rows" 
        :key="row.id"
        class="keyboard-row"
        :style="{ paddingLeft: `${getRowPadding(rIndex)}px` }"
      >
        <div 
          v-for="(key, kIndex) in row.keys"
          :key="key.id"
          class="key-wrapper"
          :style="{ width: `${key.width ? key.width * 40 : 40}px` }"
          @mouseenter="handleHover(rIndex, kIndex)"
        >
          <div 
            class="key" 
            :class="{ 'active': key.active }"
            :style="{ animationDelay: `${key.delay}s` }"
          >
            <div class="key-face key-top flex items-center justify-center text-[10px] font-mono font-bold text-gray-500/50">
              {{ key.label }}
            </div>
            <div class="key-face key-front"></div>
            <div class="key-face key-right"></div>
            <div class="key-face key-left"></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Ambient Light/Glow Overlay -->
    <div class="absolute inset-0 bg-radial-gradient pointer-events-none z-10"></div>
    <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyber-black via-cyber-black/80 to-transparent pointer-events-none z-20"></div>
  </div>
</template>

<style scoped lang="scss">
.keyboard-container {
  perspective: 1200px; /* Enhanced perspective */
  background-color: #050505;
}

.bg-radial-gradient {
  background: radial-gradient(circle at center, transparent 0%, #050505 90%);
}

.keyboard-grid {
  display: flex;
  flex-direction: column;
  gap: 10px; /* Row gap */
  transform: rotateX(55deg) rotateZ(-12deg) scale(1.4) translateY(-30px);
  transform-style: preserve-3d;
  width: auto;
  align-items: center;
}

.keyboard-row {
  display: flex;
  gap: 6px; /* Key gap */
  justify-content: center;
}

.key-wrapper {
  height: 40px;
  position: relative;
  transform-style: preserve-3d;
}

.key {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.05s ease-out; /* Snappier response */
  
  &.active {
    transform: translateZ(12px);
    
    .key-top {
      background: rgba(0, 243, 255, 0.4);
      color: theme('colors.white');
      box-shadow: 0 0 15px theme('colors.neon-cyan'), 0 0 30px theme('colors.neon-cyan');
      border-color: theme('colors.white');
      text-shadow: 0 0 5px theme('colors.white');
    }
    
    .key-front, .key-right, .key-left {
      background: theme('colors.neon-cyan');
      opacity: 0.6;
    }
  }
}

.key-face {
  position: absolute;
  border: 1px solid theme('colors.gray.800');
  transition: all 0.1s ease;
  backface-visibility: hidden;
}

.key-top {
  width: 100%;
  height: 100%;
  background: rgba(25, 25, 25, 0.95);
  transform: rotateX(0deg) translateZ(10px);
  border: 1px solid rgba(0, 243, 255, 0.15);
  border-radius: 4px; /* Slight rounding */
  
  /* Subtle float animation */
  animation: float 5s ease-in-out infinite alternate;
}

.key-front {
  width: 100%;
  height: 10px;
  background: rgba(15, 15, 15, 0.9);
  transform: rotateX(-90deg) translateZ(10px);
  top: 10px; /* Push down to form side */
  border-radius: 0 0 2px 2px;
}

.key-right {
  width: 10px;
  height: 100%;
  background: rgba(15, 15, 15, 0.9);
  transform: rotateY(90deg) translateZ(calc(100% - 10px)); /* Tricky positioning relative to width? No, simpler to anchor */
  /* Side faces are tricky with variable width. 
     Using a simpler box model approach:
  */
  right: 0;
  transform-origin: right;
  transform: rotateY(90deg);
}

.key-left {
  width: 10px;
  height: 100%;
  background: rgba(15, 15, 15, 0.9);
  left: 0;
  transform-origin: left;
  transform: rotateY(-90deg);
}

/* 
  Correction for Right/Left faces on variable width keys:
  The transform logic above for right/left depends on the container width.
  Actually simple way for css pure cube:
  Front: rotateX(-90deg) translateZ(height/2)
  Top: translateZ(depth/2)
  
  Let's stick to the previous working model but adjust for width.
  Top is Z+10.
  Front is top+10 rotated -90.
  Right/Left need to be positioned at the edges.
*/

.key-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px; /* Depth of key visually */
  height: 40px;
  transform: rotateY(90deg) translateZ(5px); /* Half of width? No */
  /* Re-think standard CSS Cube for variable width */
  transform-origin: right center;
  transform: rotateY(-90deg); /* This folds it IN? No */
}

/* 
   Let's simplify 3D for variable width.
   We just need Top and Front for the "typing" effect usually.
   Sides are visible if we rotate.
   
   If we use `transform-style: preserve-3d`, we can just place faces.
*/
.key-right {
  width: 10px; /* Depth (Z-height of key) */
  height: 100%;
  right: 0;
  top: 0;
  background: #111;
  transform-origin: right;
  transform: rotateY(90deg);
}

.key-left {
  width: 10px; /* Depth */
  height: 100%;
  left: 0;
  top: 0;
  background: #111;
  transform-origin: left;
  transform: rotateY(-90deg);
}

.key-front {
  width: 100%;
  height: 10px; /* Thickness */
  bottom: 0;
  top: auto;
  background: #0a0a0a;
  transform-origin: bottom;
  transform: rotateX(90deg);
}

/* Wait, the previous implementation had top translated Z. */
.key-top {
  transform: translateZ(10px);
}
.key-front {
  width: 100%;
  height: 10px;
  top: 100%; /* Below top */
  transform-origin: top;
  transform: rotateX(-90deg);
}
.key-right {
  width: 10px;
  height: 100%;
  left: 100%; /* Right of top */
  transform-origin: left;
  transform: rotateY(90deg);
}
.key-left {
  width: 10px;
  height: 100%;
  right: 100%; /* Left of top? No, positioning relative to Top is easiest if Top is parent? No, key is parent. */
  /* Key is the container. */
  left: 0;
  transform-origin: left;
  transform: rotateY(-90deg);
}


@keyframes float {
  0% { transform: rotateX(0deg) translateZ(10px); }
  100% { transform: rotateX(0deg) translateZ(12px); border-color: rgba(0, 243, 255, 0.3); }
}
</style>
