import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Pages from 'vite-plugin-pages'
import * as path from 'node:path'

// https://vite.dev/config/
const configuration = defineConfig({
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
      '@': path.resolve(__dirname, 'src'),
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
    allowedHosts: ['p85b4748.natappfree.cc', 'near.natapp1.cc'],
    proxy: {
      '/api': {
        target: 'http://m6ebcdfb.natappfree.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/gh-proxy': {
        target: 'https://raw.githubusercontent.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gh-proxy/, ''),
      },
      '/github-api': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/github-api/, ''),
      },
    },
  },
})

// mode 为当前环境 开发与生产 可通过变量实现动态替换配置
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  console.log('VITE_SERVER_PATH:', env.VITE_SERVER_PATH)

  return {
    ...configuration
  }
})
