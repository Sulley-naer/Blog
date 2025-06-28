<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()
</script>

<template>
    <button @click="store.toggleTheme" class="theme-toggle-btn" aria-label="切换主题">
        <component :is="store.theme === 'light' ? 'Sunny' : 'Moon'" class="theme-icon" />
    </button>
</template>

<style scoped lang="scss">
.theme-toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    transition: background-color 0.2s ease;

    &:hover {
        background-color: var(--background-color);
    }

    .theme-icon {
        width: 22px;
        height: 22px;
        transition: color 0.2s ease;
    }

    &:hover .theme-icon {
        color: var(--primary-color);
    }
}
</style>
