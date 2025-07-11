import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const theme = ref(localStorage.getItem('theme') || 'light')
  const awaitLoad = ref(false)
  // const onceLoad = ref(localStorage.getItem('onceLoad') ? false : true)
  const onceLoad = ref(true)
  const JWT = ref(localStorage.getItem('token') || '')
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }
  function toggleAwaitLoad() {
    awaitLoad.value = !awaitLoad.value
  }
  function toggleJWT(jwt: string) {
    JWT.value = jwt
  }

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    document.documentElement.className = newTheme
  })

  return { theme, toggleTheme, awaitLoad, toggleAwaitLoad, onceLoad, JWT, toggleJWT }
})
