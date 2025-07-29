<template>
  <div class="notes-page">
    <AnimatedParticles />
    <div class="notes-container glass-container">
      <div class="header-section">
        <h1 class="page-title">我的笔记</h1>
        <p class="page-subtitle">探索我的知识库</p>

        <!-- <div class="action-buttons">
          <RippleButton variant="primary" @click="handleCreateNote">
            <i class="fas fa-plus"></i>
            新建笔记
          </RippleButton>
          <RippleButton variant="secondary" @click="handleFilterNotes">
            <i class="fas fa-filter"></i>
            筛选
          </RippleButton>
        </div> -->
      </div>

      <!-- 面包屑导航 -->
      <div class="breadcrumb" v-if="currentPath.length > 0">
        <span class="breadcrumb-item" @click="navigateToRoot">根目录</span>
        <span class="breadcrumb-separator">/</span>
        <span
          v-for="(path, index) in currentPath"
          :key="index"
          class="breadcrumb-item"
          @click="navigateToPath(index)"
        >
          {{ path.name }}
          <span v-if="index < currentPath.length - 1" class="breadcrumb-separator">/</span>
        </span>
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

      <!-- 内容展示 -->
      <div v-else>
        <div class="notes-grid" v-if="githubContents.length > 0">
          <div
            v-for="item in githubContents"
            :key="item.sha"
            class="note-card glass-container"
            @click="handleItemClick(item)"
          >
            <div class="note-header">
              <div class="icon-wrapper">
                <img :src="getItemIcon(item)" :alt="item.type === 'dir' ? '文件夹' : '文件'" />
              </div>
              <h3 class="note-title">{{ item.name }}</h3>
            </div>
            <div class="note-meta">
              <span class="item-type">{{ item.type === 'dir' ? '文件夹' : '文件' }}</span>
              <span class="item-path">{{ item.path }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <h3>此目录为空</h3>
          <p>该目录下没有任何文件或文件夹</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({
    name: 'NotesPage',
  })

  import { ref, onMounted ,watch} from 'vue'
  import { useRouter } from 'vue-router'
  import AnimatedParticles from '@/components/decorative/AnimatedParticles.vue'
  import RippleButton from '@/components/ui/RippleButton.vue'
  import { getGithubContentsViaProxy as getGithubContents } from '@/utils/apis/userGithubProxy'
  import { preloadFolderStructureViaProxy as preloadFolderStructure } from '@/utils/apis/userGithubProxy'
  import { GitHubContent } from '@/types/github'

  // 添加router实例
  const router = useRouter()

  // 响应式数据
  const githubContents = ref<GitHubContent[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string>('')
  const currentPath = ref<{name: string, path: string}[]>([])

  // 当前路径URL
  const currentUrl = ref<string>('https://api.github.com/repos/Sulley-naer/Naer-Notes/contents')

  // 获取GitHub内容
  const fetchGithubContents = async (url: string = currentUrl.value) => {
    loading.value = true
    error.value = ''

    try {
      // 使用自代理方式获取内容
      const response = await getGithubContents(url)

      // 过滤掉以特殊符号开头的文件和文件夹
      const filteredContents = response.data.filter(item => {
        // 检查名称是否以字母、数字、下划线或中文开头
        return /^[a-zA-Z0-9_\u4e00-\u9fa5]/.test(item.name)
      })

      githubContents.value = filteredContents
    } catch (err) {
      console.error('获取GitHub内容失败:', err)
      error.value = err.message || '获取内容时发生未知错误'
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理项目点击事件
   * @param item - 被点击的GitHub项目
   * @returns Promise<void>
   */
  const handleItemClick = (item: GitHubContent) => {
    if (item.type === 'dir') {
      // 更新当前路径
      currentPath.value.push({ name: item.name, path: item.path })

      // 更新URL并获取新内容
      currentUrl.value = item.url

      // 更新路由参数
      router.push({
        query: {
          path: currentPath.value.map(p => p.path).join('/')
        }
      })

      fetchGithubContents(item.url)
    } else {
      // 文件处理逻辑 - 跳转到showNote页面
      console.log('点击了文件:', item.name)
      // 跳转到showNote.vue并传递文件信息
      router.push({
        path: '/notes/showNote',
        query: {
          url: item.url,  // 传递文件的API URL
          name: item.name  // 传递文件名
        }
      })
    }
  }

  /**
   * 导航到根目录
   * @returns void
   */
  const navigateToRoot = () => {
    currentPath.value = []
    currentUrl.value = 'https://api.github.com/repos/Sulley-naer/Naer-Notes/contents'

    // 更新路由参数
    router.push({
      query: {}
    })

    fetchGithubContents()
  }

  /**
   * 导航到指定路径
   * @param index - 路径索引
   * @returns void
   */
  const navigateToPath = (index: number) => {
    // 截取到指定索引的路径
    currentPath.value = currentPath.value.slice(0, index + 1)

    // 构造新的URL
    const path = currentPath.value[index].path
    currentUrl.value = `https://api.github.com/repos/Sulley-naer/Naer-Notes/contents/${path}`

    // 更新路由参数
    router.push({
      query: {
        path: currentPath.value.map(p => p.path).join('/')
      }
    })

    fetchGithubContents(currentUrl.value)
  }

  // 刷新内容
  const refreshContent = () => {
    fetchGithubContents()
  }

  /**
   * 根据文件类型获取对应的图标
   * @param item - GitHub项目对象
   * @returns 图标图片路径
   */
  const getItemIcon = (item: GitHubContent) => {
    if (item.type === 'dir') {
      // 返回文件夹图标
      return new URL('@/assets/images/icon/folder.png', import.meta.url).href
    } else {
      // 根据文件扩展名返回不同图标
      const extension = item.name.split('.').pop()?.toLowerCase()
      if (extension === 'md' || extension === 'markdown') {
        // 返回Markdown文件图标
        return new URL('@/assets/images/icon/md.png', import.meta.url).href
      } else {
        // 返回默认文件图标（可以添加更多文件类型判断）
        return new URL('@/assets/images/icon/md.png', import.meta.url).href
      }
    }
  }

  /**
   * 初始化组件数据
   * @returns void
   */
   const initialize = () => {
  // 从路由参数中恢复路径
  const pathParam = router.currentRoute.value.query.path as string
  if (pathParam) {
    const paths = pathParam.split('/')
    currentPath.value = paths.map((path, index) => ({
      name: path.split('/').pop() || path,
      path: paths.slice(0, index + 1).join('/')
    }))

    // 更新当前URL
    currentUrl.value = `https://api.github.com/repos/Sulley-naer/Naer-Notes/contents/${pathParam}`
  } else {
    // 如果没有参数，默认加载根目录
    currentPath.value = []
    currentUrl.value = 'https://api.github.com/repos/Sulley-naer/Naer-Notes/contents'
  }

  // 预加载文件夹结构（仍然使用原来的githubApi）
  preloadFolderStructure().catch(err => {
    console.warn('预加载文件夹结构失败:', err)
  })

  // 获取初始内容
  fetchGithubContents(currentUrl.value)
}


  // 组件挂载时获取初始内容
  onMounted(() => {
    initialize()
  })

watch(() => router.currentRoute.value.query.path, () => {
  initialize()
}, { immediate: true })

  </script>

<style scoped lang="scss">
.notes-page {
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

.notes-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  flex: 1;
  /* 添加以下样式以确保容器可以滚动 */
  overflow: visible;
}

/* 玻璃拟态容器 */
.glass-container {
  position: relative;
  z-index: 10;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  /* 确保容器可以正常扩展 */
  overflow: visible;
}

.header-section {
  margin-bottom: 30px;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
}

.breadcrumb-separator {
  margin: 0 10px;
  color: rgba(255, 255, 255, 0.6);
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

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.note-card {
  padding: 25px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
}

.note-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
  overflow: hidden;

}

.note-title {
  color: white;
  font-weight: 600;
  font-size: 1.3rem;
  margin: 0;
  flex: 1;
  word-break: break-word;
}

.note-meta {
  display: flex;
  flex-direction: column;

  .item-type {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.85rem;
    margin-bottom: 5px;
  }

  .item-path {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.8rem;
    font-family: monospace;
    word-break: break-word;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
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
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .notes-container {
    padding: 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }

  .breadcrumb {
    font-size: 0.9rem;
  }
}
</style>
