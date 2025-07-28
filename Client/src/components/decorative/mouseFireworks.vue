<template>
  <canvas ref="canvas" class="fixed w-full h-full pointer-events-none inset-0 z-1"></canvas>
</template>

<script setup lang="ts">
import { useMouseTrail } from '@/AnimationJs/useMouseTrail'
import { ref, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'

const props = defineProps<{
  theme?: 'dark' | 'light'
}>()

const store = useCounterStore()

const isDarkMode = computed(() => {
  if (props.theme === 'dark') return true
  if (props.theme === 'light') return false
  return store.theme === 'dark'
})

const canvas = ref<HTMLCanvasElement | null>(null)
useMouseTrail(canvas, isDarkMode)
</script>
