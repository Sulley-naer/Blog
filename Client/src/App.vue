<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
import { useCounterStore } from './stores/counter'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import Load from '@/components/globalLoading.vue'
import firstLoad from '@/components/firstLoading.vue'
const counterStore = useCounterStore()
console.log(counterStore.onceLoad)
console.log('路由跳转', isRouting.value)
</script>

<template>
  <firstLoad v-if="counterStore.onceLoad" />
  <AppHeader />
  <Load />
  <RouterView />
</template>

<style scoped></style>
