import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, "src")
    }
  },
  plugins: [
    vue(),
    WindiCSS(),
    viteCommonjs(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex'],
      dirs: ['./src/hooks', './src/api']
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://ceshi13.dishait.cn/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/bugzila': {
        target: 'http://127.0.0.1:8000',
        // target: 'http://10.240.203.241:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bugzila/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 15000
  }
})
