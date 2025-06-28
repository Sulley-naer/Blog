import { createRouter, createWebHistory } from 'vue-router'
// @ts-expect-error '~pages' 是 Vite 配置的路径别名，TypeScript 可能无法识别该模块
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
