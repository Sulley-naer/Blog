<template>
  <button :class="['btn', buttonClass]" @click="$emit('click')" >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

defineEmits<{
  click: []
}>()

const buttonClass = computed(() => `btn-${props.variant}`)

</script>

<style scoped lang="scss">
.btn {
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &.btn-primary {
    background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
    color: white;
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
    }
  }

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  pointer-events: none;
}


@media (max-width: 768px) {
  .btn {
    padding: 14px 28px;
    font-size: 14px;
  }
}
</style>
