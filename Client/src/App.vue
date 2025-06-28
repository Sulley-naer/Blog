<script setup lang="ts">
import { RouterView } from 'vue-router'
import { isRouting } from './stores/routing'
import AppHeader from '@/components/AppHeader/AppHeader.vue'
console.log(isRouting.value)
</script>

<template>
    <AppHeader />
    <RouterView />
</template>

<style scoped></style>
