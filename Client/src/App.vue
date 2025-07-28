<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
import { useCounterStore } from './stores/counter'
import Load from '@/components/loading/globalLoading.vue'
import firstLoad from '@/components/loading/firstLoading.vue'
const counterStore = useCounterStore()
console.log(counterStore.onceLoad)

watch(isRouting, (newVal) => {
  console.log('路由状态变化:', newVal)
})
console.log('路由跳转', isRouting.value)
</script>

<template>
  <div class="w-full h-full relative">
    <firstLoad v-if="counterStore.onceLoad" />
    <Load />
    <RouterView />
  </div>
</template>

<style scoped></style>
