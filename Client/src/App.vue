<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
console.log(isRouting.value)
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
}
</style>
