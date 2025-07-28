<template>
  <header class="header" :class="{ scrolled: isScrolled }" ref="header">
    <nav class="nav">
      <router-link to="/" class="logo">
        <img class="w-[50px] h-[50px]" src="@/assets/images/logo/logo_T.png" alt="" />
        SuiKnit
      </router-link>
      <ul class="nav-links">
        <li><a href="#notes" @click="scrollToSection('notes')">浏览笔记</a></li>
        <li><a href="#about" @click="scrollToSection('about')">关于我们</a></li>
        <li><a href="#coming-soon" @click="scrollToSection('coming-soon')">即将推出</a></li>
        <li><a href="#contact" @click="scrollToSection('contact')">联系我们</a></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const header = ref<HTMLElement | null>(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Increased from 100 to ensure it stays above all content */
  padding: 20px 0;
  height: 90px; /* Explicit height for consistent calculations */
  transition: all 0.3s ease;

  &.scrolled {
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;

  i {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 32px;
  }
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 30px;
  align-items: center;

  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    padding: 8px 16px;
    border-radius: 25px;
    cursor: pointer;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 0 20px;
  }

  .nav-links {
    display: none;
  }
}
</style>
