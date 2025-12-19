import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/product': 'http://localhost:3000',
      '/branch': 'http://localhost:3000',
      '/auth': 'http://localhost:3000',
      '/search': 'http://localhost:3000',
      '/examine': 'http://localhost:3000',
      '/receipt': 'http://localhost:3000',
      '/report': 'http://localhost:3000',
      '/vaccine': 'http://localhost:3000',
    }
  }
})
