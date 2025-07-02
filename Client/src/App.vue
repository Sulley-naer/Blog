<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
import Load from '@/components/globalLoading.vue'
console.log('路由跳转', isRouting.value)
</script>

<template>
  <AppHeader />
  <Load />
  <RouterView />
</template>

<style scoped></style>
