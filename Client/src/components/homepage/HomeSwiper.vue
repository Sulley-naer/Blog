<template>
  <div class="home-swiper-container">
    <swiper
      :modules="modules"
      direction="vertical"
      :slides-per-view="1"
      :mousewheel="true"
      :keyboard="true"
      :space-between="0"
      :speed="800"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
      class="home-swiper"
    >
      <swiper-slide v-for="(section, index) in sectionsWithoutFooter" :key="index" class="swiper-slide">
        <div class="slide-content">
          <component
            :is="section.component"
            @navigate-to-slide="handleNavigateToSlide"
          />
        </div>
      </swiper-slide>
    </swiper>

    <div class="swiper-pagination-custom">
      <div
        v-for="(section, index) in sectionsWithoutFooter"
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

import HeroSection from './HeroSection.vue'
import AboutSection from './AboutSection.vue'
import ServicesSection from './ServicesSection.vue'
import ContactSection from './ContactSection.vue'

// 定义暴露给父组件的方法
defineExpose({
  goToContactSlide,
  goToSlide
})

const modules = [Mousewheel, Keyboard]

const activeIndex = ref(0)
const swiperInstance = ref<SwiperType | null>(null)

const sectionsWithoutFooter = [
  { component: HeroSection, label: '首页' },
  { component: AboutSection, label: '关于' },
  { component: ServicesSection, label: '服务' },
  { component: ContactSection, label: '联系' }
]

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = () => {
  if (swiperInstance.value) {
    activeIndex.value = swiperInstance.value.activeIndex
  }
}

function goToSlide(index: number){
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index)
  }
}

// 新增：跳转到联系页面的方法
function goToContactSlide() {
  goToSlide(3)
}

const handleNavigateToSlide = (index: number) => {
  goToSlide(index)
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
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .swiper-slide.footer-slide {
    height: auto;
    min-height: 100vh;
  }

  .slide-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

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
