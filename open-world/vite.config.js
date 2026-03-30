import { defineConfig } from 'vite'

export default defineConfig({
  // base: '/threejs-open-world/',
  server: {
    proxy: {
      // 开发时前端请求 /api/* 转发到后端，路径去掉 /api 前缀 → 与 curl localhost:3000/user/register 一致
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: false,
  }
})
