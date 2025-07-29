<template>
  <canvas ref="canvas" class="particles"></canvas>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAnimatedParticles } from '@/AnimationJs/useAnimatedParticles'

const canvas = ref<HTMLCanvasElement | null>(null)

// 使用canvas动画粒子效果
useAnimatedParticles(canvas, 200)
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
</style>
