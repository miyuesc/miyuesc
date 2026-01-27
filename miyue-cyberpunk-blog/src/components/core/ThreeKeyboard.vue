<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';

const containerRef = ref<HTMLElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationFrameId: number;
const keys: THREE.Mesh[] = [];

onMounted(() => {
  if (!containerRef.value) return;

  // 1. Scene Setup
  scene = new THREE.Scene();
  // Fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.05);

  // 2. Camera
  camera = new THREE.PerspectiveCamera(75, containerRef.value.clientWidth / containerRef.value.clientHeight, 0.1, 1000);
  camera.position.set(0, 5, 8);
  camera.lookAt(0, 0, 0);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  containerRef.value.appendChild(renderer.domElement);

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f3ff, 2); // Neon Cyan
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xbc13fe, 2); // Neon Purple
  pointLight2.position.set(-5, 5, -5);
  scene.add(pointLight2);

  // 5. Create Abstract Keyboard Grid
  const geometry = new THREE.BoxGeometry(0.8, 0.5, 0.8);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    emissive: 0x00ff41,
    emissiveIntensity: 0.1,
    roughness: 0.2,
    metalness: 0.8
  });

  const rows = 6;
  const cols = 15;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const key = new THREE.Mesh(geometry, material.clone()); // Clone material for individual color control if needed
      // Clicky mechanism visual
      key.position.x = (j - cols / 2) * 1.0;
      key.position.z = (i - rows / 2) * 1.0;
      
      scene.add(key);
      keys.push(key);

      // Random initial delay for "boot up" animation
      gsap.to(key.position, {
        y: 0.5,
        duration: 0.5,
        delay: Math.random() * 2,
        yoyo: true,
        repeat: -1,
        repeatDelay: Math.random() * 5,
        ease: "power1.inOut"
      });
      
      // Add hover effect logic here via Raycaster if needed, 
      // but for background ambient effect, random ripples are good.
    }
  }

  // 6. Animation Loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    
    // Slight camera drift
    const time = Date.now() * 0.0005;
    camera.position.x = Math.sin(time) * 1;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  animate();

  // Resize Handler
  window.addEventListener('resize', handleResize);
});

const handleResize = () => {
  if (!containerRef.value) return;
  camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
  renderer.dispose();
  // Cleanup meshes...
});
</script>

<template>
  <div ref="containerRef" class="w-full h-full absolute inset-0 z-0 opacity-60 pointer-events-none"></div>
</template>
