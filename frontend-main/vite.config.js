import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Any request to /api will be forwarded to the FastAPI backend
      '/api': {
        target: 'http://ai_backend:8000',
        changeOrigin: true,
      }
    }
  }
})
