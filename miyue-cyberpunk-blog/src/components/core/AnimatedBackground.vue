<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const containerRef = ref<HTMLElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let animationFrameId: number;
let particles: THREE.Points;
let mouseX = 0;
let mouseY = 0;

onMounted(() => {
  if (!containerRef.value) return;

  // Setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  containerRef.value.appendChild(renderer.domElement);

  // Particles
  const geometry = new THREE.BufferGeometry();
  const count = 2000;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 200; // Spread
    velocities[i] = (Math.random() - 0.5) * 0.1; // Speed
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0x00f3ff, // Neon Cyan
    size: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Interaction
  document.addEventListener('mousemove', onMouseMove);

  // Animation
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update by velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Mouse repulsion simplified
      const dx = positions[i3] - (mouseX * 100); 
      const dy = positions[i3 + 1] - (-mouseY * 100); 
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 20) {
        const angle = Math.atan2(dy, dx);
        positions[i3] += Math.cos(angle) * 0.5;
        positions[i3 + 1] += Math.sin(angle) * 0.5;
      }

      // Reset if out of bounds (loop)
      if (positions[i3] > 100 || positions[i3] < -100) positions[i3] = (Math.random() - 0.5) * 200;
      if (positions[i3 + 1] > 100 || positions[i3 + 1] < -100) positions[i3 + 1] = (Math.random() - 0.5) * 200;
    }

    particles.geometry.attributes.position.needsUpdate = true;
    
    // Rotation
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    renderer.render(scene, camera);
  };

  animate();
  window.addEventListener('resize', handleResize);
});

const onMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
};

const handleResize = () => {
  if (!containerRef.value) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', onMouseMove);
  cancelAnimationFrame(animationFrameId);
  renderer.dispose();
});
</script>

<template>
  <div ref="containerRef" class="fixed inset-0 z-0 pointer-events-none"></div>
</template>
