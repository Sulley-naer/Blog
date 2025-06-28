<script setup lang="ts">
interface Post {
  id: number;
  title: string;
  date: string;
  snippet: string;
  tags: string[];
}

defineProps<{ post: Post }>()
</script>

<template>
  <article class="post-card">
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
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
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
}

.post-snippet {
  margin-top: 1rem;
  color: var(--text-color-secondary);
  line-height: 1.6;
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
  &:hover {
    text-decoration: underline;
  }
}
</style>
