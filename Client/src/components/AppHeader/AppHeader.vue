<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'
import HeaderAuth from './HeaderAuth.vue'
import ThemeToggle from './ThemeToggle.vue'
import GithubIcon from './GithubIcon.vue'

const store = useCounterStore()
const headerInnerRef = ref<HTMLElement | null>(null)
const proximityThreshold = 300
const mouseMoveTimer = ref<NodeJS.Timeout | null>(null)
const inactivityTimeout = 500

const isLoggedIn = ref(false)
const user = ref({
  name: '张三',
  avatar: computed(() => {
    return store.theme === 'dark'
      ? '/src/assets/images/default/dark.png'
      : '/src/assets/images/default/light.png';
  }),
  email: 'zhangsan@wudang.com'
})

const handleMouseMove = (event: MouseEvent) => {
  if (headerInnerRef.value) {
    const rect = headerInnerRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    headerInnerRef.value.style.setProperty('--mouse-x', `${x}px`)
    headerInnerRef.value.style.setProperty('--mouse-y', `${y}px`)

    if (mouseMoveTimer.value) clearTimeout(mouseMoveTimer.value)
    if (event.clientY < proximityThreshold) {
      headerInnerRef.value.style.setProperty('--spotlight-opacity', '1')
      mouseMoveTimer.value = setTimeout(() => {
        headerInnerRef.value?.style.setProperty('--spotlight-opacity', '0')
      }, inactivityTimeout)
    } else {
      headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
    }
  }
}

const handleMouseLeave = () => {
  if (headerInnerRef.value) {
    headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
  }
  if (mouseMoveTimer.value) {
    clearTimeout(mouseMoveTimer.value)
    mouseMoveTimer.value = null
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  console.log('用户已退出登录')
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  if (mouseMoveTimer.value) clearTimeout(mouseMoveTimer.value)
})

watch(() => store.theme, () => {
  if (headerInnerRef.value) {
    headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
  }
})
</script>

<template>
  <header class="app-header">
    <div class="header-inner" ref="headerInnerRef">
      <div class="glow-layer"></div>
      <div class="header-content">
        <router-link to="/" class="logo">MyCoolBlog</router-link>
        <nav class="navigation">
          <div class="nav-links">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/post" class="nav-link">文章</router-link>
            <router-link to="/about" class="nav-link">关于</router-link>
          </div>
          <div class="nav-actions">
            <HeaderAuth :is-logged-in="isLoggedIn" :user="user" @logout="handleLogout" />
            <ThemeToggle />
            <a href="https://github.com/Sulley-naer/Blog" target="_blank" rel="noopener noreferrer"
              class="action-icon-btn" aria-label="GitHub">
              <GithubIcon class="action-icon" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-inner {
  position: relative;
  background-color: var(--header-bg-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease;
}

.glow-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    left: var(--mouse-x, 50%);
    top: var(--mouse-y, 50%);
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    opacity: var(--spotlight-opacity, 0);
    transition: opacity 0.5s ease;
    background-image: radial-gradient(circle, var(--primary-color) 0%, transparent 60%);
    filter: blur(100px);
  }
}

.header-content {
  position: relative;
  z-index: 2;
  background-color: transparent;
  box-shadow: none;

  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
    /* 稍微减小间距，让图标按钮更紧凑 */
  }
  
  .nav-link {
    color: var(--text-color-secondary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
  
    &:hover {
      color: var(--primary-color);
    }
  
    &.router-link-exact-active {
      color: var(--primary-color);
      font-weight: 600;
  /* **3. 新增图标按钮的样式** */
    .action-icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 6px;
      color: var(--text-color);
      transition: background-color 0.2s ease, color 0.2s ease;
  
      &:hover {
        background-color: var(--background-color);
        color: var(--primary-color);
      }
  
      .action-icon {
        width: 22px;
        height: 22px;
      }
    }

  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }
}
</style>
