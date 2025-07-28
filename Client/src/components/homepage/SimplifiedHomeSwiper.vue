<template>
  <div class="home-swiper-container">
    <swiper
      :modules="modules"
      direction="vertical"
      :slides-per-view="1"
      :space-between="0"
      :mousewheel="true"
      :keyboard="true"
      :speed="800"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
      class="home-swiper"
    >
      <swiper-slide v-for="(section, index) in sections" :key="index" class="swiper-slide">
        <div class="slide-content">
          <component :is="section.component" />
        </div>
      </swiper-slide>
    </swiper>

    <!-- 简化版导航指示器 -->
    <div class="swiper-pagination-custom">
      <div
        v-for="(section, index) in sections"
        :key="index"
        :class="['pagination-dot', { active: activeIndex === index }]"
        @click="goToSlide(index)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

// 导入所有部分组件
import HeroSection from './HeroSection.vue'
import AboutSection from './AboutSection.vue'
import ServicesSection from './ServicesSection.vue'
import ContactSection from './ContactSection.vue'
import HomeFooter from './HomeFooter.vue'

// Swiper 模块
const modules = [Mousewheel, Keyboard]

// 响应式数据
const activeIndex = ref(0)
const swiperInstance = ref<SwiperType | null>(null)

// 定义所有部分
const sections = [
  { component: HeroSection, label: '首页' },
  { component: AboutSection, label: '关于' },
  { component: ServicesSection, label: '服务' },
  { component: ContactSection, label: '联系' },
  { component: HomeFooter, label: '底部' },
]

// Swiper 事件处理
const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = () => {
  if (swiperInstance.value) {
    activeIndex.value = swiperInstance.value.activeIndex
  }
}

const goToSlide = (index: number) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index)
  }
}
</script>

<style scoped>
.home-swiper-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.home-swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  height: calc(100vh - 90px);
  padding-top: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-slide:last-child {
  height: auto;
  min-height: calc(100vh - 90px);
}

.slide-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 简化版分页指示器 */
.swiper-pagination-custom {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pagination-dot {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-dot:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.pagination-dot.active {
  background: #4ecdc4;
  box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
}

@media (max-width: 768px) {
  .swiper-pagination-custom {
    right: 15px;
  }

  .pagination-dot {
    width: 10px;
    height: 10px;
  }
}
</style>
