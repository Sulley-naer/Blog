<script setup lang="ts">
import { ref } from 'vue'
 import PostCard from './PostCard.vue'

const posts = ref([
  { id: 1, title: '初探 Rolldown: 下一代前端构建工具', date: '2025年6月27日', snippet: 'Vite 正在尝试使用 Rust 编写的 Rolldown 作为其核心打包器，性能究竟如何？让我们一探究竟。', tags: ['Vite', 'Rust', '前端'] },
  { id: 2, title: 'Vue 3 组合式 API 的最佳实践', date: '2025年6月15日', snippet: '从 Options API 到 Composition API，我们失去了什么，又得到了什么？这里有一些让你的代码更优雅的建议。', tags: ['Vue', 'TypeScript'] },
  { id: 3, title: '如何用 CSS 变量实现优雅的主题切换', date: '2025年5月30日', snippet: '本文将带你从零开始，利用 CSS 自定义属性和一行 JavaScript 代码，实现完美的亮/暗模式切换功能。', tags: ['CSS', '设计', 'Web'] },
])
</script>

<template>
  <div class="post-list">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<style scoped lang="scss">
.post-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
</style>