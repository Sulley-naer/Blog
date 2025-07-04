<script setup lang="ts">
// **移除了所有与 PostList 相关的导入和逻辑**
import HeroSection from '@/components/index/HeroSection.vue'
import FeatureGrid from '@/components/index/FeatureGrid.vue'
import AppFooter from '@/components/index/AppFooter.vue'
import BackToTop from '@/components/index/BackToTop.vue'

defineOptions({
  name: 'HomePage'
})
</script>

<template>
  <div class="home-page">
    <BackToTop />

    <!-- 英雄区域 -->
    <HeroSection />

    <!-- 主内容区域，现在只包含特性网格 -->
    <main class="main-content">
      <FeatureGrid />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.home-page {
  position: relative;
}

// **样式简化**
.main-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
  }
  
</style>
