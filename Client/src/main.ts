import './assets/styles/theme.scss'
import './assets/styles/style.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useCounterStore } from './stores/counter'
import { watch } from 'vue'

import App from './App.vue'
import router from './router'
import { isRouting } from './stores/routing'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

const counterStore = useCounterStore()

watch(
  () => counterStore.theme,
  (newTheme) => {
    document.documentElement.className = newTheme
  },
  { immediate: true }
)

router.beforeEach((to, from, next) => {
  isRouting.value = true
  next()
})
router.afterEach(() => {
  isRouting.value = false
})
router.onError(() => {
  isRouting.value = false
})



if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
}
