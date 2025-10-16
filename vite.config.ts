import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 Vue 相关库分离
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 Element Plus 核心分离
          'element-plus': ['element-plus'],
          // 将 Element Plus 图标分离
          'element-icons': ['@element-plus/icons-vue'],
          // 将 Supabase 分离
          'supabase': ['@supabase/supabase-js'],
          // 将其他第三方库分离
          'vendor': ['axios']
        }
      }
    },
    // 增加 chunk 大小警告限制
    chunkSizeWarningLimit: 1000
  }
})