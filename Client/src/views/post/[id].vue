<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

interface Post {
  id: number
  title: string
  date: string
  snippet: string
  tags: string[]
  content: string
}
const posts: Post[] = [
  {
    id: 1,
    title: '初探 Rolldown: 下一代前端构建工具',
    date: '2025年6月27日',
    snippet:
      'Vite 正在尝试使用 Rust 编写的 Rolldown 作为其核心打包器，性能究竟如何？让我们一探究竟。',
    tags: ['Vite', 'Rust', '前端'],
    content: `
      <h2>什么是 Rolldown？</h2>
      <p>Rolldown 是一个用 Rust 编写的 JavaScript 打包器，旨在为 Vite 提供核心打包能力。它的目标是同时拥有 Rollup 的 API 兼容性和 esbuild 的极致性能。</p>
      <p>这意味着开发者可以期待未来 Vite 的冷启动速度和构建速度得到数量级的提升，而无需更改太多现有配置。</p>
      <pre><code>// vite.config.js 中启用方式 (示例)
export default defineConfig({
  // 未来可能出现的配置
  bundler: 'rolldown'
})</code></pre>
      <blockquote>这是一个激动人心的进步，它可能会重新定义前端工具链的性能标准。</blockquote>
      <p>我们对这个项目保持高度关注，并将在后续带来更深入的性能评测报告。</p>
    `,
  },
  {
    id: 2,
    title: 'Vue 3 组合式 API 的最佳实践',
    date: '2025年6月15日',
    snippet:
      '从 Options API 到 Composition API，我们失去了什么，又得到了什么？这里有一些让你的代码更优雅的建议。',
    tags: ['Vue', 'TypeScript'],
    content: `
      <h2>拥抱组合式函数</h2>
      <p>组合式 API 的核心优势在于逻辑的提取和复用。不要把所有东西都写在组件的 setup 函数里。将相关的、可复用的逻辑（如数据请求、事件监听、状态管理）封装成独立的组合式函数（Composables）。</p>
      <p>例如，创建一个 <code>useUserData.ts</code> 文件来处理用户数据的获取和管理，可以让组件本身保持清爽。</p>
    `,
  },
  {
    id: 3,
    title: '如何用 CSS 变量实现优雅的主题切换',
    date: '2025年5月30日',
    snippet:
      '本文将带你从零开始，利用 CSS 自定义属性和一行 JavaScript 代码，实现完美的亮/暗模式切换功能。',
    tags: ['CSS', '设计', 'Web'],
    content: `
      <h2>核心原理</h2>
      <p>我们通过在根元素（如 <code><html></code>）上切换一个 class (例如 'dark')，来改变一组预先定义好的 CSS 变量的值。整个应用都使用这些 CSS 变量来定义颜色，从而实现全局的主题切换。</p>
      <pre><code>:root {
  --background-color: #ffffff;
  --text-color: #333333;
}

html.dark {
  --background-color: #121212;
  --text-color: #e0e0e0;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}</code></pre>
      <p>这种方法的优势在于它的高效和简洁。浏览器原生支持，无需复杂的库或框架。</p>
    `,
  },
]

const route = useRoute()
const postId = computed(() => route.params.id)

const post = computed(() => {
  const id = Array.isArray(postId.value) ? postId.value[0] : postId.value
  return posts.find((p) => p.id === Number(id))
})
</script>

<template>
  <div class="post-page">
    <AppHeader />

    <main class="post-container">
      <div class="back-link-wrapper">
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </div>

      <Transition name="fade-up" appear>
        <article v-if="post" class="post-content-wrapper">
          <header class="post-header">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
              <span class="post-date">{{ post.date }}</span>
              <div class="tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
              </div>
            </div>
          </header>

          <div class="post-content" v-html="post.content"></div>
        </article>

        <div v-else class="not-found">
          <h2>404 - 文章未找到</h2>
          <p>抱歉，我们没有找到您要访问的文章，它可能已被删除或路径不正确。</p>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped lang="scss">
.post-page {
  padding-top: 60px;
}

.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
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

.post-header {
  border-bottom: 1px solid var(--background-color);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.post-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.tags {
  display: flex;
  gap: 0.75rem;
  .tag {
    font-size: 0.8rem;
  }
}

.post-content {
  color: var(--text-color);
  line-height: 1.8;

  :deep(h2) {
    font-size: 1.8rem;
    margin: 2.5rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--background-color);
  }
  :deep(p) {
    margin-bottom: 1.25rem;
  }
  :deep(blockquote) {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    background-color: var(--background-color);
    border-left: 4px solid var(--primary-color);
    border-radius: 4px;
    p {
      margin-bottom: 0;
    }
  }
  :deep(pre) {
    background-color: var(--background-color);
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'Courier New', Courier, monospace;
  }
  :deep(code) {
    font-family: inherit;
  }
}

.not-found {
  text-align: center;
  padding: 4rem 0;
  h2 {
    font-size: 2rem;
    color: var(--primary-color);
  }
  p {
    color: var(--text-color-secondary);
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
