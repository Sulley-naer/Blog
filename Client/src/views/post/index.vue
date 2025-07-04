<template>
    <div class="posts-page">
        <BackToTop />
        <main class="content-wrapper">
            <div class="page-header">
                <h1 class="page-title">Blog Notes</h1>
                <p class="page-subtitle">一个动态的、由 GitHub 驱动的知识库。</p>
            </div>

            <div v-if="isLoadingRoot" class="loading-indicator">
                正在从 GitHub 加载知识库...
            </div>

            <div v-if="rootError" class="error-indicator">
                加载失败: {{ rootError.message }}
            </div>

            <div v-if="rootContents" class="repo-list">
                <RecursiveFolder :items="rootContents" />
            </div>
        </main>
        <AppFooter />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BackToTop from '@/components/BackToTop.vue'
import AppFooter from '@/components/index/AppFooter.vue'
import RecursiveFolder from '@/components/RecursiveFolder.vue'
import type { GitHubContent } from '@/types/github'
import { useLazyFetch } from '@/utils/useFetch'

defineOptions({ name: 'PostsPage' })

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

const {
    data: rootContents,
    error: rootError,
    loading: isLoadingRoot,
    refetch: fetchRootContents
} = useLazyFetch<GitHubContent[]>(
    'https://api.github.com/repos/Sulley-naer/Naer-Notes/contents/',
    {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    }
)

onMounted(() => {
    fetchRootContents()
})
</script>

<style scoped lang="scss">
.posts-page {
    position: relative;
}

.content-wrapper {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem 1.5rem;
}

.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    font-size: 3rem;
    font-weight: 800;
    color: var(--text-color);
    margin-bottom: 1rem;
}

.page-subtitle {
    font-size: 1.25rem;
    color: var(--text-color-secondary);
}

.loading-indicator,
.error-indicator {
    text-align: center;
    padding: 2rem;
    background-color: var(--card-bg-color);
    border-radius: 12px;
    color: var(--text-color-secondary);
}

.error-indicator {
    color: #e53e3e;
}

.repo-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
