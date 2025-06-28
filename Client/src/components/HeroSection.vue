<!-- 推荐路径: src/components/HeroSection.vue -->
<template>
  <section class="hero-section">
    <h1 class="hero-title">探索、创造、分享</h1>
    <p class="hero-subtitle">一个记录技术思考与生活灵感的空间。</p>
  </section>
</template>

<style scoped lang="scss">
.hero-section {
  text-align: center;
  padding: 4rem 0;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-color-secondary);
}
</style>