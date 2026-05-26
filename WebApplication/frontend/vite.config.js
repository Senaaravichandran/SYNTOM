import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '/encrypt': 'http://localhost:5006',
      '/decrypt': 'http://localhost:5006',
      '/health': 'http://localhost:5006',
      '/braided': 'http://localhost:5006',
      '/ipfs': 'http://localhost:5006',
      '/share': 'http://localhost:5006',
      '/receive': 'http://localhost:5006',
      '/getCameras': 'http://localhost:5006',
      '/updateVectorStore': 'http://localhost:5006',
      '/createFlorenceDocument': 'http://localhost:5006',
      '/getResponse': 'http://localhost:5006',
    }
  }
})
