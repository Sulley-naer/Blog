<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import PostCard from './PostCard.vue'

import gsap from 'gsap'
import { Flip } from 'gsap/Flip'

const props = defineProps<{
  layout: string
}>()

const posts = ref([
  { id: 1, title: 'Rolldown: 下一代前端构建工具', date: '2025年6月28日', snippet: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', tags: ['Vite', 'Rust', '前端'] },
  { id: 2, title: '深入 Vue 3 响应式系统', date: '2025年6月25日', snippet: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', tags: ['Vue', 'JavaScript'] },
  { id: 3, title: '使用 SCSS 实现高级主题化', date: '2025年6月22日', snippet: 'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', tags: ['CSS', 'SCSS', '前端'] },
  { id: 4, title: '探索 WebAssembly 的潜力', date: '2025年6月20日', snippet: 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', tags: ['WASM', '性能优化'] },
  { id: 5, title: 'TypeScript 高级类型技巧', date: '2025年6月18日', snippet: 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', tags: ['TypeScript', '前端'] },
  { id: 6, title: '构建可访问性的 Web 应用', date: '2025年6月15日', snippet: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', tags: ['A11y', 'Web'] },
  { id: 7, title: 'GSAP 动画实战指南', date: '2025年6月12日', snippet: 'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg', tags: ['GSAP', '动画', '前端'] },
  { id: 8, title: 'Vitest 单元测试最佳实践', date: '2025年6月10日', snippet: 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', tags: ['Vitest', '测试'] },
  { id: 9, title: '深入理解 Vue 的 nextTick', date: '2025年6月8日', snippet: 'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', tags: ['Vue', 'JavaScript'] },
  { id: 10, title: 'CSS 定位上下文详解', date: '2025年6月5日', snippet: 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', tags: ['CSS'] },
  { id: 11, title: '现代前端框架的响应式原理', date: '2025年6月3日', snippet: 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', tags: ['前端', '架构'] },
  { id: 12, title: '博客美学：字体与排版的艺术', date: '2025年6月1日', snippet: 'lllllllllllllllllllllllllllllllllllllllllllllllllllllllllll', tags: ['设计', 'UI'] },
])

onMounted(() => {
  gsap.registerPlugin(Flip)
})

const listRef = ref<HTMLElement | null>(null)

watch(() => props.layout, async (newLayout, oldLayout) => {
  if (!listRef.value || newLayout === oldLayout) return

  const cards = listRef.value.querySelectorAll(".post-card") as NodeListOf<HTMLElement>;
  const state = Flip.getState(cards);

  await nextTick();

  Flip.from(state, {
    duration: 0.7,
    ease: "power3.inOut",
    stagger: 0.05,
    absolute: true,
    props: "width, height",

    onStart: (elements) => {
      if (Array.isArray(elements)) {
        elements.forEach(el => el.classList.add('is-flipping'));
      }
    },
    onComplete: (elements) => {
      if (Array.isArray(elements)) {
        elements.forEach(el => el.classList.remove('is-flipping'));
      }
    }
  });
})
</script>

<template>
  <div ref="listRef" class="post-list" :class="[layout === 'grid' ? 'grid-layout' : 'list-layout']">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>


<style scoped lang="scss">
.post-list {
  display: grid;
  gap: 1.5rem;
  min-height: 400px;
  position: relative;
}

.list-layout {
  grid-template-columns: 1fr;
}

.grid-layout {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>
