import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [vue(), vueDevTools()],

    server: {
      allowedHosts: [
        '27210fd4c74d.ngrok-free.app', // 添加需要允许的主机
        '967hv37146.zicp.fun',
      ],
      host: '0.0.0.0',
      port: 5173,
      hmr: true,
      proxy: {
        // 使用环境变量配置代理目标
        '/api': {
          target: env.VITE_BACKEND_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
