<template>
  <div class="homepage">
    <AnimatedParticles />
    <HomeHeader @navigate-to-contact="handleNavigateToContact(3)" />
    <HomeSwiper ref="homeSwiperRef" />
    <HomeFooter />
  </div>
</template>

<script setup lang="ts">
// 组件名称
defineOptions({
  name: 'HomePage',
})

import { ref } from 'vue'
import AnimatedParticles from '@/components/decorative/AnimatedParticles.vue'
import HomeHeader from '@/components/homepage/HomeHeader.vue'
import HomeSwiper from '@/components/homepage/HomeSwiper.vue'
import HomeFooter from '@/components/homepage/HomeFooter.vue'

// 获取Swiper组件的引用
const homeSwiperRef = ref<InstanceType<typeof HomeSwiper> | null>(null)

function handleNavigateToContact(index) {
  if (homeSwiperRef.value) {
    homeSwiperRef.value.goToSlide(index)
  }
}
</script>

<!-- ... 样式部分保持不变 ... -->

<style scoped lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .homepage {
    font-family:
      'Inter',
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    min-height: 100vh;
    overflow-x: hidden;
    overflow-y: auto; /* 允许垂直滚动 */
    position: relative;
    display: flex;
    flex-direction: column;
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
  }

  /* 确保页面占满整个视口 */
  html,
  body {
    height: auto;
    overflow: auto;
    overflow-x: hidden;
  }

  #app {
    height: auto;
    min-height: 100vh;
    overflow: hidden;
  }
  </style>
