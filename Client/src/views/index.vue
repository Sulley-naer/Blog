<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import PostList from '@/components/PostList.vue'
import AppFooter from '@/components/AppFooter.vue'

defineOptions({
  name: 'HomePage'
})
</script>

<template>
  <div class="home-page">
    <main class="content-wrapper">
      <HeroSection />
      <PostList />
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
