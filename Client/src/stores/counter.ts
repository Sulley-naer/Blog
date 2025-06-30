import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const theme = ref(localStorage.getItem('theme') || 'light')

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  })

  //TODO 你这个count是复制过来没删吗 留着干啥？
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment, theme, toggleTheme }
})
