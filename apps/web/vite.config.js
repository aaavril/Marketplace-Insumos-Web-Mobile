import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Permite importar desde packages/core-logic usando rutas absolutas
      '@core-logic': path.resolve(__dirname, '../../packages/core-logic/src'),
    },
  },
})
