/**
 * vite.config.js - CONFIGURACIÓN DE VITE
 * 
 * Vite es el build tool y dev server para esta aplicación web.
 * Este archivo configura cómo Vite compila y sirve la aplicación.
 * 
 * ¿Qué hace Vite?
 * - Dev Server: Sirve la aplicación durante desarrollo (npm run dev)
 * - Build Tool: Compila la aplicación para producción (npm run build)
 * - Bundler: Combina archivos JavaScript en bundles optimizados
 * - Transpiler: Convierte JSX y ES6+ a JavaScript compatible
 * 
 * Configuraciones principales:
 * - plugins: Plugins de Vite (React plugin para soportar JSX)
 * - resolve.alias: Permite usar alias para importar archivos más fácilmente
 */

// defineConfig: Función helper de Vite para autocompletado y validación de configuración
import { defineConfig } from 'vite'

// Plugin de React para Vite: Permite usar JSX y transforma archivos .jsx
import react from '@vitejs/plugin-react'

// path: Módulo de Node.js para trabajar con rutas de archivos
import path from 'path'

// fileURLToPath: Convierte una URL de archivo a una ruta de sistema de archivos
import { fileURLToPath } from 'url'

/**
 * Obtener __dirname en módulos ES
 * 
 * En CommonJS (require), __dirname está disponible automáticamente.
 * En ES Modules (import/export), no existe __dirname, así que lo creamos manualmente.
 * 
 * import.meta.url: URL del archivo actual (ej: "file:///C:/ruta/al/archivo/vite.config.js")
 * fileURLToPath(): Convierte la URL a una ruta del sistema (ej: "C:\ruta\al\archivo\vite.config.js")
 * path.dirname(): Obtiene el directorio del archivo (ej: "C:\ruta\al\archivo")
 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Configuración de Vite
 * 
 * @see https://vite.dev/config/
 * 
 * Esta configuración define:
 * 1. Plugins: Qué plugins usar (React para soportar JSX)
 * 2. Alias: Rutas cortas para importar archivos más fácilmente
 */
export default defineConfig({
  // Plugins de Vite
  plugins: [
    // Plugin de React: Habilita el soporte para JSX y React Fast Refresh
    // Fast Refresh: Actualiza componentes sin perder el estado durante desarrollo
    react()
  ],
  
  // Configuración de resolución de módulos
  resolve: {
    // Alias: Permite usar rutas cortas en lugar de rutas relativas largas
    alias: {
      // 
      // Alias @core-logic:
      // Permite importar desde packages/core-logic usando @core-logic en lugar de rutas relativas
      // 
      // Ejemplo de uso:
      // Antes: import { useAppState } from '../../../packages/core-logic/src/context/GlobalStateContext.jsx'
      // Ahora:  import { useAppState } from '@core-logic/context/GlobalStateContext.jsx'
      // 
      // path.resolve(): Resuelve la ruta absoluta del directorio core-logic
      // __dirname: Directorio actual (apps/web)
      // '../../packages/core-logic/src': Ruta relativa desde apps/web hasta packages/core-logic/src
      //
      '@core-logic': path.resolve(__dirname, '../../packages/core-logic/src'),
    },
  },
})
