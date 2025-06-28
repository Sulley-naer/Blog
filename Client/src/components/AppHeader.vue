<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
const headerInnerRef = ref<HTMLElement | null>(null)
const proximityThreshold = 300

const handleMouseMove = (event: MouseEvent) => {
  if (headerInnerRef.value) {
    const rect = headerInnerRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    headerInnerRef.value.style.setProperty('--mouse-x', `${x}px`)
    headerInnerRef.value.style.setProperty('--mouse-y', `${y}px`)

    if (event.clientY < proximityThreshold) {
      headerInnerRef.value.style.setProperty('--spotlight-opacity', '1')
    } else {
      headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
    }
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

watch(
  () => store.theme,
  (newTheme) => {
    if (newTheme === 'light' && headerInnerRef.value) {
      headerInnerRef.value.style.setProperty('--spotlight-opacity', '0')
    }
  },
)
</script>

<template>
  <header class="app-header">
    <div class="header-inner" ref="headerInnerRef">
      <div class="header-content">
        <div class="logo">MyCoolBlog</div>
        <nav class="navigation">
          <a href="#" class="nav-link active">首页</a>
          <a href="#" class="nav-link">归档</a>
          <a href="#" class="nav-link">关于</a>
          <button @click="store.toggleTheme" class="theme-toggle-btn" aria-label="切换主题">
            <component :is="store.theme === 'light' ? 'Sunny' : 'Moon'" class="theme-icon" />
          </button>
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
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: var(--mouse-x);
    top: var(--mouse-y);
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background-image: radial-gradient(circle, rgba(0, 198, 255, 0.2) 0%, transparent 60%);
    pointer-events: none;
    transition: opacity 0.5s ease;
    html.dark & {
      opacity: var(--spotlight-opacity, 0);
    }
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
  gap: 1.5rem;
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
.theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  .theme-icon {
    width: 22px;
    height: 22px;
    transition: color 0.2s ease;
  }
  &:hover .theme-icon {
    color: var(--primary-color);
  }
}
</style>
