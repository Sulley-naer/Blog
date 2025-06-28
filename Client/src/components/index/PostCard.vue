<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

interface Post {
  id: number;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
}

defineProps<{ post: Post }>()

const cardRef = ref<HTMLElement | null>(null)

const handleMouseEnter = () => {
  if (!cardRef.value) return

  gsap.killTweensOf(cardRef.value)

  gsap.to(cardRef.value, {
    y: -5,
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    duration: 0.3,
    ease: 'power2.out'
  })
}

const handleMouseLeave = () => {
  if (!cardRef.value) return

  gsap.killTweensOf(cardRef.value)

  gsap.to(cardRef.value, {
    y: 0,
    boxShadow: 'var(--card-shadow)',
    duration: 0.4,
    ease: 'power2.out'
  })
}
</script>

<template>
  <article ref="cardRef" class="post-card" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <header class="card-header">
      <span class="post-date">{{ post.date }}</span>
      <h2 class="post-title">{{ post.title }}</h2>
    </header>
    <p class="post-snippet">{{ post.snippet }}</p>
    <footer class="card-footer">
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
      </div>
      <router-link :to="`/post/PostDetail`" class="read-more">
        阅读全文 →
      </router-link>
    </footer>
  </article>
</template>

<style scoped lang="scss">
.post-card {
  background-color: var(--card-bg-color);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);

}

.post-date {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  margin-bottom: 0.5rem;
  display: block;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
  overflow-wrap: break-word;
}

.post-snippet {
  color: var(--text-color-secondary);
  line-height: 1.6;
  overflow-wrap: break-word;
  flex-grow: 1;
}

.card-footer {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  .tag {
    font-size: 0.8rem;
    color: var(--text-color-secondary);
  }
}

.read-more {
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    text-decoration: underline;
  }
}
  
</style>
