// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true // 自動開啟瀏覽器
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,   // 生產環境中禁用開發工具
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false  // 禁用水合不匹配詳細信息
  }
});