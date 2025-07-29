<template>
  <div class="markdown-page">
    <AnimatedParticles />
    <div class="markdown-container glass-container">
      <div class="header-section">
        <h1 class="page-title">{{ fileName }}</h1>
        <div class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          返回
        </div>
      </div>

      <!-- 内容加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>正在加载内容...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <RippleButton variant="primary" @click="refreshContent">重新加载</RippleButton>
      </div>

      <!-- Markdown内容展示 -->
      <div v-else class="markdown-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MarkdownPage',
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AnimatedParticles from '@/components/decorative/AnimatedParticles.vue'
import RippleButton from '@/components/ui/RippleButton.vue'
import { renderMarkdownToHtml } from '@/utils/markdownParser'
import { getGithubContents } from '@/utils/apis/githubApi' // 引入GitHub API函数

// 响应式数据
const renderedContent = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string>('')
const fileName = ref<string>('')

// 路由
const route = useRoute()
const router = useRouter()

// 获取Markdown内容
const fetchMarkdownContent = async (url: string) => {
  loading.value = true
  error.value = ''

  try {
    // 使用githubApi.ts中的函数获取文件信息
    const response = await getGithubContents(url)
    const data = response.data
    
    // 获取文件名
    fileName.value = data.name || '文档'
    
    // 正确解码Base64内容（支持UTF-8编码的中文字符）
    const binaryString = atob(data.content)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const content = new TextDecoder('utf-8').decode(bytes)
    
    // 解析Markdown为HTML
    renderedContent.value = await renderMarkdownToHtml(content)
  } catch (err) {
    console.error('获取Markdown内容失败:', err)
    error.value = err.message || '获取内容时发生未知错误'
  } finally {
    loading.value = false
  }
}

// 刷新内容
const refreshContent = () => {
  const url = route.query.url as string
  if (url) {
    fetchMarkdownContent(url)
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 组件挂载时获取内容
onMounted(() => {
  const url = route.query.url as string
  if (url) {
    fetchMarkdownContent(url)
  } else {
    error.value = '未提供文件URL'
  }
})
</script>

<style scoped lang="scss">
.markdown-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.markdown-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  flex: 1;
  overflow: visible;
}

/* Glassmorphism container */
.glass-container {
  position: relative;
  z-index: 10;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

.header-section {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;

  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1rem;
  }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 60px 20px;

  .error-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    color: #ff6b6b;
  }

  h3 {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 15px;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    max-width: 500px;
    margin: 0 auto 25px;
  }
}

/* Markdown内容样式 */
.markdown-content {
  color: white;
  line-height: 1.6;

  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin: 24px 0 16px 0;
    font-weight: 700;
    color: #fff;
  }

  :deep(h1) {
    font-size: 2.2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 10px;
  }

  :deep(h2) {
    font-size: 1.8rem;
  }

  :deep(p) {
    margin: 16px 0;
    font-size: 1.1rem;
  }

  :deep(a) {
    color: #64b5f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', monospace;
    font-size: 0.9rem;
  }

  :deep(pre) {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 16px;
    overflow-x: auto;
    margin: 20px 0;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(ul), :deep(ol) {
    padding-left: 30px;
    margin: 16px 0;
  }

  :deep(li) {
    margin: 8px 0;
  }

  :deep(blockquote) {
    border-left: 4px solid #64b5f6;
    padding: 10px 20px;
    margin: 20px 0;
    background: rgba(100, 181, 246, 0.1);
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 20px 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }

  :deep(th), :deep(td) {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  :deep(th) {
    background: rgba(255, 255, 255, 0.1);
    font-weight: 600;
  }

  :deep(tr:last-child td) {
    border-bottom: none;
  }
}

@media (max-width: 768px) {
  .markdown-container {
    padding: 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .markdown-content {
    :deep(h1) {
      font-size: 1.8rem;
    }

    :deep(h2) {
      font-size: 1.5rem;
    }

    :deep(p) {
      font-size: 1rem;
    }
  }
}
</style>
