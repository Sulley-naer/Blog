<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { renderMarkdownToHtml } from '@/utils/markdownParser'
import IndexFilm from '@/components/IndexFilm.vue'
import BackToTop from '@/components/BackToTop.vue'

const route = useRoute()

const htmlContent = ref<string>('')
const postTitle = ref<string>('')
const isLoading = ref(true)
const error = ref<string | null>(null)

// 统一与 index.vue 的 GitHub API 方式，支持私有仓库和 token
const GITHUB_REPO_API = 'https://api.github.com/repos/Sulley-naer/Naer-Notes/contents/'
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

const fetchOptions = {
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3.raw',
  },
}

const fetchAndRenderMarkdown = async (filePath: string | string[]) => {
  if (!filePath || Array.isArray(filePath)) {
    error.value = '无效的文章路径。'
    isLoading.value = false
    return
  }

  postTitle.value = filePath.split('/').pop()?.replace('.md', '') || '文章详情'

  isLoading.value = true
  error.value = null
  try {
    // 直接用 GitHub API 获取文件内容（raw）
    const response = await fetch(`${GITHUB_REPO_API}${filePath}`, fetchOptions)
    if (!response.ok) {
      throw new Error(`无法获取 Markdown 文件，服务器响应: ${response.status}`)
    }
    const markdownText = await response.text()
    htmlContent.value = await renderMarkdownToHtml(markdownText)
  } catch (err: Error | unknown) {
    console.error('处理文章时出错:', err)
    error.value = (err as Error).message || '加载或解析文章时出现未知错误。'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAndRenderMarkdown(route.query.path as string)
})

watch(
  () => route.query.path,
  (newPath) => {
    if (newPath) {
      fetchAndRenderMarkdown(newPath as string)
    }
  },
)
</script>

<template>
  <div class="post-page">
    <BackToTop />
    <div class="filmBox1">
      <index-film />
    </div>
    <div class="filmBox2">
      <index-film />
    </div>
    <main class="post-container">
      <div class="back-link-wrapper">
        <router-link to="/post" class="back-link">← 返回文章列表</router-link>
      </div>

      <Transition name="fade-up" mode="out-in" appear>
        <div v-if="isLoading" key="loading" class="status-indicator">
          <p>正在加载文章...</p>
        </div>

        <div v-else-if="error" key="error" class="status-indicator error">
          <h2>文章加载失败</h2>
          <p>{{ error }}</p>
        </div>

        <article v-else-if="htmlContent" key="content" class="post-content-wrapper">
          <h1 class="post-title">{{ postTitle }}</h1>
          <div class="post-content" v-html="htmlContent"></div>
        </article>
      </Transition>
    </main>
  </div>
</template>

<style scoped lang="scss">
/* 样式部分完全保持不变 */
.post-page {
  position: relative;
  width: 100%;
  height: 100%;
}

.filmBox1 {
  position: fixed;
  top: 70%;
  left: -20%;
  transform: rotate(30deg);
  width: 100%;
  height: 25%;
  z-index: 1;
}

.filmBox2 {
  position: fixed;
  top: 50%;
  right: -20%;
  transform: rotate(-30deg);
  width: 130%;
  height: 25%;
  z-index: 2;
}

.status-indicator {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-color-secondary);

  &.error {
    h2 {
      color: #e53e3e;
      margin-bottom: 1rem;
    }
  }
}

.post-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  z-index: 3;
}

.back-link-wrapper {
  margin-bottom: 2rem;

  .back-link {
    color: var(--text-color-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-color);
    }
  }
}

.post-content-wrapper {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  padding: 2rem 3rem;
  box-shadow: var(--card-shadow);
}

.post-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--dropdown-border-color);
}

.post-content {
  color: var(--text-color);
  line-height: 1.8;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin-top: 2em;
    margin-bottom: 1em;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
