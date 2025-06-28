<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from '@/components/index/HeroSection.vue'
import PostList from '@/components/index/PostList.vue'
import AppFooter from '@/components/index/AppFooter.vue'
import ViewOptions from '@/components/index/ViewOptions.vue'
import BackToTop from '@/components/index/BackToTop.vue'

defineOptions({
  name: 'HomePage'
})

const currentLayout = ref('list')

const handleLayoutUpdate = (newLayout: string) => {
  currentLayout.value = newLayout
}
</script>

<template>
  <div class="home-page">
    <BackToTop />
    <main class="content-wrapper">
      <HeroSection />
      <ViewOptions @update:layout="handleLayoutUpdate" />
      <PostList :layout="currentLayout" />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.home-page {
  position: relative;

  .content-wrapper {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
}

</style>
