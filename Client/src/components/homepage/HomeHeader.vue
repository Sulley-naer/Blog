<template>
  <header class="header" :class="{ scrolled: isScrolled }" ref="header">
    <nav class="nav">
      <router-link to="/" class="logo">
        <img class="w-[50px] h-[50px]" src="@/assets/images/logo/logo_T.png" alt="" />
        SuiKnit
      </router-link>
      <ul class="nav-links">
        <li><router-link to="/notes">浏览笔记</router-link></li>
        <li><router-link to="/about">关于</router-link></li>
        <li><router-link to="/coming-soon">即将推出</router-link></li>
        <!-- 修改：使用点击事件而不是路由跳转 -->
        <li><a @click="goToContact">联系我们</a></li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 定义触发跳转到联系页面的事件
const emit = defineEmits(['navigate-to-contact'])

const isScrolled = ref(false)
const header = ref<HTMLElement | null>(null)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 新增：跳转到联系页面的方法
function goToContact() {
  emit('navigate-to-contact')
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
  z-index: 1000;
  padding: 20px 0;
  height: 90px;
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
    background-clip: text;
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
