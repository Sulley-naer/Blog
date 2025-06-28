<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { renderMarkdownToHtml } from '@/utils/markdownParser'

const htmlContent = ref<string>('')
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch('/doc/Css.md')

    if (!response.ok) {
      throw new Error(`无法获取 Markdown 文件，状态码: ${response.status}`)
    }

    const markdownText = await response.text()
    htmlContent.value = await renderMarkdownToHtml(markdownText)

  } catch (err: any) {
    console.error("处理文章时出错:", err)
    error.value = err.message || '加载或解析文章时出现未知错误。'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="post-page">
    <AppHeader />

    <main class="post-container">
      <div class="back-link-wrapper">
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </div>

      <div v-if="isLoading" class="status-indicator">
        <p>正在加载文章...</p>
      </div>

      <div v-else-if="error" class="status-indicator error">
        <h2>文章加载失败</h2>
        <p>{{ error }}</p>
      </div>

      <div v-else>
        <Transition name="fade-up" appear>
          <article v-if="htmlContent" class="post-content-wrapper">

            <!-- 【核心修复】使用 v-html 指令来渲染HTML字符串 -->
            <div class="post-content" v-html="htmlContent"></div>

          </article>
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
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

.post-content {
  color: var(--text-color);
  line-height: 1.8;

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin-top: 2em;
    margin-bottom: 1em;
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

  :deep(code) {
    font-family: inherit;
  }
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
