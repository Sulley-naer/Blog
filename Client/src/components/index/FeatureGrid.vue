<template>
    <div class="feature-grid-container">
        <div class="feature-grid">
            <div v-for="feature in features" :key="feature.title" class="feature-card">
                <div class="feature-icon" v-html="feature.icon"></div>
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const features = ref([
    {
        title: '深度技术剖析',
        description: '深入探讨前端框架的底层原理、性能优化与工程化实践。',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 9 8 12 2 12"></polyline><path d="M5.45 5.45L2 2v6h6L5.45 5.45z"></path></svg>`
    },
    {
        title: '前沿趋势洞察',
        description: '追踪最新的 Web 技术、工具和设计理念，保持知识库的持续更新。',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
    },
    {
        title: '生活灵感随笔',
        description: '记录技术之外的思考、阅读感悟与生活中的美好瞬间。',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
    }
]);
</script>

<style scoped lang="scss">
.feature-grid-container {
    padding: 4rem 0;
    border-top: 1px solid var(--dropdown-border-color);
    border-bottom: 1px solid var(--dropdown-border-color);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.feature-card {
    background-color: var(--card-bg-color);
    padding: 2rem;
    border-radius: 12px;
    text-align: left;
    border: 1px solid transparent;
    transition: border-color 0.3s ease, transform 0.3s ease;
}

.feature-icon {
    display: inline-flex;
    padding: 0.75rem;
    background-color: var(--primary-color-10);
    /* 假设有这个变量，或用 rgba */
    background-color: rgba(var(--primary-color), 0.1);
    border-radius: 8px;
    margin-bottom: 1.5rem;
    color: var(--primary-color);
}

.feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.75rem;
}

.feature-description {
    font-size: 0.95rem;
    color: var(--text-color-secondary);
    line-height: 1.6;
}
</style>
