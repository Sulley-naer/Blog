<script setup lang="ts">
import { ref } from 'vue'
 import PostCard from './PostCard.vue'

const posts = ref([
  { id: 1, title: 'Rolldown: 下一代前端构建工具', date: '2025年6月28日', snippet: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tags: ['Vite', 'Rust', '前端'] },
  { id: 2, title: 'Rolldown: 下一代前端构建工具', date: '2025年6月28日', snippet: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tags: ['Vite', 'Rust', '前端'] },
  { id: 3, title: 'Rolldown: 下一代前端构建工具', date: '2025年6月28日', snippet: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tags: ['Vite', 'Rust', '前端'] },
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
