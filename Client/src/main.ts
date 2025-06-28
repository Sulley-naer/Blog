import './assets/styles/theme.scss'
import './assets/styles/style.scss'
import './assets-styles/highlight.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useCounterStore } from './stores/counter'
import { watch } from 'vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'
import { isRouting } from './stores/routing'

const app = createApp(App)

app.use(createPinia())
app.use(autoAnimatePlugin)
app.use(router)

const counterStore = useCounterStore()

const initializeTheme = () => {
  if (!localStorage.getItem('theme')) {
    const currentHour = new Date().getHours()

    if (currentHour < 7 || currentHour >= 19) {
      counterStore.theme = 'dark'
    }
  }
}

initializeTheme()

document.documentElement.className = counterStore.theme

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

app.mount('#app')

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
}
