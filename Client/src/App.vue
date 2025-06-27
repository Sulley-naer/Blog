<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
console.log(isRouting.value)
</script>

<template>
    <RouterView />
</template>

<style scoped>

</style>
