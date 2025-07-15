<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import type { GitHubContent } from '@/types/github'
import { useLazyFetch } from '@/utils/useFetch'
import gsap from 'gsap'

const RecursiveFolder = defineAsyncComponent(() => import('./RecursiveFolder.vue'))

defineProps<{
    items: GitHubContent[]
}>()

const GITHUB_REPO_API = 'https://api.github.com/repos/Sulley-naer/Naer-Notes/contents/'
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

const openFolders = ref<Record<string, boolean>>({})
const folderContents = ref<Record<string, GitHubContent[]>>({})
const isLoading = ref<Record<string, boolean>>({})
const error = ref<Record<string, Error | null>>({})

const toggleFolder = async (folder: GitHubContent) => {
    const path = folder.path
    if (openFolders.value[path]) {
        openFolders.value[path] = false
    } else {
        if (!folderContents.value[path]) {
            isLoading.value[path] = true
            error.value[path] = null

            const { data, error: fetchError, refetch } = useLazyFetch<GitHubContent[]>(
                `${GITHUB_REPO_API}${path}`,
                {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                }
            )

            try {
                await refetch()
                if (data.value) {
                    folderContents.value[path] = data.value
                }
            } catch (e) {
                if (fetchError.value) {
                    error.value[path] = fetchError.value
                } else {
                    error.value[path] = e instanceof Error ? e : new Error('Unknown fetch error')
                }
            } finally {
                isLoading.value[path] = false
            }
        }
        openFolders.value[path] = true
    }
}

const onEnter = (el: Element, done: () => void) => {
    gsap.fromTo(el,
        { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 },
        { height: 'auto', opacity: 1, marginTop: '0.5rem', marginBottom: '0.5rem', duration: 0.5, ease: 'expo.out', onComplete: done }
    )
}
const onLeave = (el: Element, done: () => void) => {
    gsap.to(el,
        { height: 0, opacity: 0, marginTop: 0, marginBottom: 0, duration: 0.4, ease: 'expo.in', onComplete: done }
    )
}
</script>

<template>
    <div class="folder-tree">
        <div v-for="item in items" :key="item.path" class="tree-item">
            <!-- 文件夹 -->
            <div v-if="item.type === 'dir'" class="folder-container">
                <button class="folder-item" @click="toggleFolder(item)" :class="{ 'is-open': openFolders[item.path] }">
                    <svg class="folder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M4 7V5a2 2 0 0 1 2-2h5l2 2h6a2 2 0 0 1 2 2v2H4z"></path>
                        <path d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9H4z"></path>
                    </svg>
                    <span class="folder-name">{{ item.name }}</span>
                    <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </button>
                <Transition @enter="onEnter" @leave="onLeave">
                    <div v-if="openFolders[item.path]" class="nested-container">
                        <div v-if="isLoading[item.path]" class="status-indicator">加载中...</div>
                        <div v-if="error[item.path]" class="status-indicator error">加载失败: {{ error[item.path]?.message
                            }}</div>
                        <RecursiveFolder v-if="folderContents[item.path]" :items="folderContents[item.path]" />
                    </div>
                </Transition>
            </div>

            <!-- 文件 -->
            <div v-else class="file-item">
                <template v-if="item.name.endsWith('.md')">
                    <router-link :to="{ path: '/post/articleDetail', query: { path: item.path } }" class="file-link">
                        <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        {{ item.name }}
                    </router-link>
                </template>
                <template v-else>
                    <a :href="item.html_url" target="_blank" rel="noopener noreferrer" class="file-link">
                        <svg class="file-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        {{ item.name }}
                    </a>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.folder-tree {
    width: 100%;
}

.tree-item {
    margin-top: 0.5rem;
}

.folder-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem 1.5rem;
    background-color: var(--card-bg-color);
    border-radius: 8px;
    border: 1px solid var(--dropdown-border-color);
    cursor: pointer;
    text-align: left;
    transition: background-color 0.2s, border-color 0.2s;
    color: var(--text-color);

    &:hover {
        background-color: var(--background-color);
        border-color: var(--primary-color);
    }

    &.is-open {
        background-color: var(--background-color);
        border-color: var(--primary-color);

        .chevron-icon {
            transform: rotate(180deg);
        }
    }
}

.folder-icon {
    width: 20px;
    height: 20px;
    margin-right: 1rem;
    color: var(--primary-color);
    fill: currentColor;
}

.folder-name {
    flex-grow: 1;
    font-size: 1.1rem;
    font-weight: 500;
}

.chevron-icon {
    width: 20px;
    height: 20px;
    color: var(--text-color-secondary);
    transition: transform 0.3s ease;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
}

.nested-container {
    overflow: hidden;
    padding-left: 1rem;
    margin-left: 1.75rem;
    border-left: 2px solid var(--dropdown-border-color);
}

.file-item {
    list-style: none;
    margin-left: 1.75rem;
    padding-left: 1rem;
    border-left: 2px solid var(--dropdown-border-color);
}

.file-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: var(--text-color-secondary);
    text-decoration: none;
    border-radius: 6px;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
        color: var(--primary-color);
        background-color: var(--dropdown-item-hover-bg);
    }
}

.file-icon {
    width: 16px;
    height: 16px;
    margin-right: 1rem;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
}

.status-indicator {
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    color: var(--text-color-secondary);

    &.error {
        color: #e53e3e;
    }
}
</style>
