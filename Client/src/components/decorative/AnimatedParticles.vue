<template>
  <div class="particles" ref="particlesContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const particlesContainer = ref<HTMLElement | null>(null)

const createParticles = () => {
  if (!particlesContainer.value) return

  const particleCount = 50
  particlesContainer.value.innerHTML = ''

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 6 + 's'
    particle.style.animationDuration = Math.random() * 3 + 3 + 's'
    particlesContainer.value.appendChild(particle)
  }
}

onMounted(() => {
  createParticles()
})
</script>

<style scoped lang="scss">
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}
</style>
