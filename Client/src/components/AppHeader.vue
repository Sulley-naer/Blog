<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
const headerInnerRef = ref<HTMLElement | null>(null)
const proximityThreshold = 300
const mouseMoveTimer = ref<NodeJS.Timeout | null>(null)
const inactivityTimeout = 500
const mrtxurl = ref('')

// 用户状态模拟
const isLoggedIn = ref(false)
const user = ref({
  name: '张三',
  avatar: computed(() => {
    return store.theme === 'dark'
      ? '/src/assets/images/default/dark.png'  // 暗模式头像路径
      : '/src/assets/images/default/light.png'; // 亮模式头像路径
  }),
  email: 'zhangsan@example.com'
})

// 下拉菜单状态
const showUserDropdown = ref(false)

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
        if (headerInnerRef.value) {
          headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
        }
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

// 用户相关操作
const handleLogin = () => {
  // 这里应该调用登录弹窗或跳转到登录页面
  console.log('打开登录弹窗')
}

const handleRegister = () => {
  // 这里应该调用注册弹窗或跳转到注册页面
  console.log('打开注册弹窗')
}

const handleLogout = () => {
  isLoggedIn.value = false
  showUserDropdown.value = false
  console.log('用户已退出登录')
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-dropdown-container')) {
    showUserDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseleave', handleMouseLeave)
  document.removeEventListener('click', handleClickOutside)
  if (mouseMoveTimer.value) clearTimeout(mouseMoveTimer.value)
})

watch(
  () => store.theme,
  (newTheme) => {
    if (headerInnerRef.value) {
      headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
    }
  }
)

// 模拟登录状态切换（仅用于演示）
const toggleLoginStatus = () => {
  isLoggedIn.value = !isLoggedIn.value
}
toggleLoginStatus()
</script>

<template>
  <header class="app-header">
    <div class="header-inner" ref="headerInnerRef">
      <div class="header-content">
        <div class="logo">MyCoolBlog</div>

        <nav class="navigation">
          <!-- 主导航链接 -->
          <div class="nav-links">
            <a href="#" class="nav-link active">首页</a>
            <a href="#" class="nav-link">归档</a>
            <a href="#" class="nav-link">关于</a>
          </div>

          <!-- 右侧操作区域 -->
          <div class="nav-actions">
            <!-- 未登录状态 -->
            <div v-if="!isLoggedIn" class="auth-buttons">
              <button @click="handleLogin" class="auth-btn login-btn">登录</button>
              <button @click="handleRegister" class="auth-btn register-btn">注册</button>
            </div>

            <!-- 已登录状态 -->
            <div v-else class="user-dropdown-container">
              <button @click="toggleUserDropdown" class="user-profile-btn">
                <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                <span class="user-name">{{ user.name }}</span>
                <svg class="dropdown-icon" :class="{ 'rotated': showUserDropdown }" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>

              <!-- 用户下拉菜单 -->
              <div v-show="showUserDropdown" class="user-dropdown">
                <div class="dropdown-header">
                  <img :src="user.avatar" :alt="user.name" class="dropdown-avatar" />
                  <div class="user-info">
                    <div class="user-display-name">{{ user.name }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  个人资料
                </a>
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z">
                    </path>
                  </svg>
                  账户设置
                </a>
                <a href="#" class="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  我的文章
                </a>
                <div class="dropdown-divider"></div>
                <button @click="handleLogout" class="dropdown-item logout-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16,17 21,12 16,7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  退出登录
                </button>
              </div>
            </div>

            <!-- 主题切换按钮 -->
            <button @click="store.toggleTheme" class="theme-toggle-btn" aria-label="切换主题">
              <component :is="store.theme === 'light' ? 'Sunny' : 'Moon'" class="theme-icon" />
            </button>

            <!-- 演示按钮（实际使用时可移除）
            <button @click="toggleLoginStatus" class="demo-btn" title="切换登录状态（演示用）">
              {{ isLoggedIn ? '模拟退出' : '模拟登录' }}
            </button> -->
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
  z-index: 1000;
}

.header-inner {
  position: relative;
  background-color: var(--header-bg-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    left: var(--mouse-x, 50%);
    top: var(--mouse-y, 50%);
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      pointer-events: none;
      opacity: var(--spotlight-opacity, 0);
      transition: opacity 1s ease;
      background-image: radial-gradient(circle, var(--spotlight-color) 0%, transparent 60%);
      }
      }
      
      .header-content {
        position: relative;
        z-index: 2;
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
          gap: 1rem;
        }
        
        .nav-link {
          color: var(--text-color-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        
          &:hover,
          &.active {
            color: var(--primary-color);
          }
        }
        
        /* 认证按钮样式 */
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .auth-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid;
        
          &.login-btn {
            background: transparent;
            color: var(--text-color);
            border-color: var(--text-color-secondary);
        
            &:hover {
              color: var(--primary-color);
              border-color: var(--primary-color);
            }
          }
        
          &.register-btn {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        
            &:hover {
              background: color-mix(in srgb, var(--primary-color) 90%, black);
              border-color: color-mix(in srgb, var(--primary-color) 90%, black);
            }
          }
        }
        
        /* 用户下拉菜单样式 */
        .user-dropdown-container {
          position: relative;
        }
        
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: var(--text-color);
        
          &:hover {
            background-color: var(--background-color);
          }
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary-color);
        }
        
        .user-name {
          font-weight: 500;
          font-size: 0.875rem;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .dropdown-icon {
          transition: transform 0.2s ease;
        
          &.rotated {
            transform: rotate(180deg);
          }
        }
        
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          width: 240px;
          background: var(--card-bg-color);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border: 1px solid var(--background-color);
          overflow: hidden;
          z-index: 1000;
        }
        
        .dropdown-header {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--background-color);
        }
        
        .dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-info {
          flex: 1;
          min-width: 0;
        }
        
        .user-display-name {
          font-weight: 600;
          color: var(--text-color);
          font-size: 0.875rem;
        }
        
        .user-email {
          color: var(--text-color-secondary);
          font-size: 0.75rem;
          margin-top: 0.125rem;
        }
        
        .dropdown-divider {
          height: 1px;
          background: var(--background-color);
          margin: 0.5rem 0;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          color: var(--text-color);
          text-decoration: none;
          font-size: 0.875rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        
          &:hover {
            background-color: var(--background-color);
          }
        
          svg {
            flex-shrink: 0;
            color: var(--text-color-secondary);
          }
        
          &.logout-item {
            color: #e53e3e;
        
            svg {
              color: #e53e3e;
            }
        
            &:hover {
              background-color: rgba(229, 62, 62, 0.1);
            }
          }
        }
        
        .theme-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          transition: background-color 0.2s ease;
        
          &:hover {
            background-color: var(--background-color);
          }
        
          .theme-icon {
            width: 22px;
            height: 22px;
            transition: color 0.2s ease;
          }
        
          &:hover .theme-icon {
            color: var(--primary-color);
          }
        }
        
        /* 演示按钮样式（实际使用时可移除） */
        .demo-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          color: #666;
        
          &:hover {
            background: #e0e0e0;
          }
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        
          .user-name {
            display: none;
          }
        
          .user-dropdown {
            width: 200px;
          }
        
          .auth-buttons {
            gap: 0.5rem;
        
            .auth-btn {
              padding: 0.375rem 0.75rem;
              font-size: 0.8rem;
            }
          }
        }
</style>
