<template>
  <div class="feature-card" @mouseenter="$emit('hover', feature.id)">
    <div class="feature-icon">
      <i :class="feature.icon"></i>
    </div>
    <div class="feature-title">{{ feature.title }}</div>
    <div class="feature-desc">{{ feature.description }}</div>
  </div>
</template>

<script setup lang="ts">
interface Feature {
  id: number
  icon: string
  title: string
  description: string
}

interface Props {
  feature: Feature
}

defineProps<Props>()

defineEmits<{
  hover: [id: number]
}>()
</script>

<style scoped lang="scss">
.feature-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 12px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feature-title {
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
</style>
