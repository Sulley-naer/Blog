import './assets/styles/style.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { isRouting } from './stores/routing'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

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
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
}
