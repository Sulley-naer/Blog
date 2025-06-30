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
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
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

  //TODO 把这里的服务器IP用 env 文件变量来配置,不会bing vite env 文件读取 还能优化到 开发与生产环境自动切换地址
  server: {
    host: '0.0.0.0',
    cors: {
      origin: ['ra6368f6.natappfree.cc'],
      credentials: true,
    },
    allowedHosts: ['ra6368f6.natappfree.cc'],
    proxy: {
      '/api': {
        target: 'http://ra6368f6.natappfree.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
