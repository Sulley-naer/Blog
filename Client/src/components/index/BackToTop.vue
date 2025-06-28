<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

// 1. 创建一个引用，用于存储我们真正的滚动容器
let scrollContainer: HTMLElement | null = null;

const handleScroll = () => {
    // 2. 从正确的容器获取滚动距离 (使用 scrollTop)
    if (scrollContainer) {
        isVisible.value = scrollContainer.scrollTop > 300
    }
}

const scrollToTop = () => {
    // 3. 让正确的容器滚动到顶部
    scrollContainer?.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    // 4. 在组件挂载后，找到我们真正的滚动容器。
    // 在标准的 Vue 应用中，它几乎总是 id 为 'app' 的 div。
    scrollContainer = document.getElementById('app');

    if (scrollContainer) {
        // 5. 将事件监听器添加到正确的容器上！
        scrollContainer.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    // 6. 在组件卸载时，从正确的容器上移除监听器
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
