import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Pages from 'vite-plugin-pages'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    Pages({
      dirs: 'src/views',
    }),
  ],
  assetsInclude: ['**/*.lottie'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    setupFiles: ['src/tests/setupPinia.ts'],
  },

  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },

  // 支持通过 .env 文件配置服务器地址，自动区分开发/生产环境
  server: {
    host: '0.0.0.0',
    cors: {
      origin: [process.env.VITE_ALLOWED_ORIGIN || 'localhost'],
      credentials: true,
    },
    allowedHosts: [process.env.VITE_ALLOWED_ORIGIN || 'localhost'],
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/gh-proxy': {
        // 目标服务器是我们想要请求的 GitHub raw 内容地址
        target: 'https://raw.githubusercontent.com',
        // 必须设置为 true，否则代理会失败
        changeOrigin: true,
        // 重写路径：在将请求发给目标服务器前，移除路径中的 '/gh-proxy' 部分
        rewrite: (path) => path.replace(/^\/gh-proxy/, ''),
      },
    },
  },
})
