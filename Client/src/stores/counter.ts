import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const theme = ref('light')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { count, doubleCount, increment, theme, toggleTheme }
})
