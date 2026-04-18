import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const target = env.VITE_API_TARGET || 'https://localhost:8443'
  const isLocalhost = target.includes('localhost')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: true,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,

          // 👇 ここがポイント
          rewrite: isLocalhost
            ? (path) => path.replace(/^\/api/, '') // localhost用
            : (path) => path, // cellar-app.localはそのまま
        },
      },
    },
  }
})
