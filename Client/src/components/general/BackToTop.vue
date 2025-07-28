<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

let scrollContainer: HTMLElement | null = null;

const handleScroll = () => {
    if (scrollContainer) {
        isVisible.value = scrollContainer.scrollTop > 300
    }
}

const scrollToTop = () => {
    scrollContainer?.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    scrollContainer = document.getElementById('app');

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    // 6. 
    if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
    }
})
</script>

<template>
    <transition name="fade">
        <button v-if="isVisible" class="back-to-top" @click="scrollToTop" aria-label="返回顶部">
            ↑
        </button>
    </transition>
</template>

<style scoped lang="scss">
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    border: none;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: opacity 0.3s ease, transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;

    &:hover {
        transform: scale(1.1);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
