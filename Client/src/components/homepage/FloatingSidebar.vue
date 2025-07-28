<template>
  <div class="floating-sidebar" :class="{ visible: isVisible }">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h3>快速导航</h3>
      </div>

      <nav class="sidebar-nav">
        <a
          v-for="link in navigationLinks"
          :key="link.id"
          :href="link.href"
          :class="['nav-link', { active: activeSection === link.id }]"
          @click="scrollToSection(link.href)"
        >
          <i :class="link.icon"></i>
          <span>{{ link.text }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="scroll-top" @click="scrollToTop">
          <i class="fas fa-arrow-up"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const activeSection = ref('')

interface NavigationLink {
  id: string
  href: string
  text: string
  icon: string
}

const navigationLinks: NavigationLink[] = [
  {
    id: 'hero',
    href: '#hero',
    text: '首页',
    icon: 'fas fa-home',
  },
  {
    id: 'about',
    href: '#about',
    text: '关于我们',
    icon: 'fas fa-info-circle',
  },
  {
    id: 'services',
    href: '#services',
    text: '服务',
    icon: 'fas fa-cogs',
  },
  {
    id: 'contact',
    href: '#contact',
    text: '联系我们',
    icon: 'fas fa-envelope',
  },
]

const handleScroll = () => {
  // 显示/隐藏侧边栏
  isVisible.value = window.scrollY > 300

  // 更新当前活动部分
  const sections = navigationLinks.map((link) => link.id)
  const scrollPosition = window.scrollY + 100

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i])
    if (section && section.offsetTop <= scrollPosition) {
      activeSection.value = sections[i]
      break
    }
  }
}

const scrollToSection = (href: string) => {
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.floating-sidebar {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
}

.sidebar-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.sidebar-header {
  margin-bottom: 20px;

  h3 {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    margin: 0;
  }
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    font-size: 0.9rem;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateX(-5px);
    }

    &.active {
      background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    i {
      font-size: 1rem;
      width: 20px;
      text-align: center;
    }

    span {
      white-space: nowrap;
    }
  }
}

.sidebar-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .scroll-top {
    width: 100%;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      transform: translateY(-2px);
    }

    i {
      font-size: 1rem;
    }
  }
}

@media (max-width: 768px) {
  .floating-sidebar {
    right: 15px;

    .sidebar-content {
      padding: 15px;
    }

    .nav-link {
      padding: 10px 12px;
      font-size: 0.8rem;

      span {
        display: none;
      }

      i {
        font-size: 1.2rem;
      }
    }
  }
}
</style>
