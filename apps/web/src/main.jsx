/**
 * main.jsx - PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN WEB
 * 
 * Este archivo es el primer archivo JavaScript que se ejecuta cuando
 * el navegador carga la aplicación. Su función principal es:
 * 1. Importar React y ReactDOM
 * 2. Importar el componente raíz (App)
 * 3. Importar los Providers de Context (GlobalStateProvider, AuthProvider)
 * 4. Montar la aplicación React en el DOM
 * 
 * Flujo de ejecución:
 * index.html → main.jsx → App.jsx → AppRouter.jsx → Páginas
 */

// React: Biblioteca principal para construir interfaces de usuario
import React from 'react'

// ReactDOM: API para renderizar componentes React en el DOM del navegador
import ReactDOM from 'react-dom/client'

// Componente raíz de la aplicación que contiene toda la lógica
import App from './App.jsx'

// Provider del estado global: permite que todos los componentes accedan al estado compartido
import { GlobalStateProvider } from '@core-logic/context/GlobalStateContext.jsx'

// Provider de autenticación: maneja el estado de autenticación del usuario
import { AuthProvider } from '@core-logic/context/AuthContext.jsx'

// Estilos globales de la aplicación (CSS)
import './index.css'

/**
 * Monta la aplicación React en el DOM
 * 
 * ReactDOM.createRoot():
 * - Crea un "root" de React en el elemento con id="root" del HTML
 * - Este es el método moderno (React 18+) para renderizar aplicaciones
 * 
 * .render():
 * - Renderiza el componente App y todos sus hijos dentro del root
 * - Todo lo que está dentro del render() se renderiza en el DOM
 * 
 * React.StrictMode:
 * - Modo estricto de React que ayuda a detectar problemas durante desarrollo
 * - No afecta la producción, solo ayuda durante el desarrollo
 * - Ejecuta algunas verificaciones adicionales y advertencias
 * 
 * Jerarquía de Providers:
 * - GlobalStateProvider: Envuelve toda la app con el estado global
 * - AuthProvider: Envuelve la app con la lógica de autenticación (usa GlobalStateProvider internamente)
 * - App: Componente principal que renderiza el router y las rutas
 * 
 * IMPORTANTE: El orden de los Providers importa:
 * - AuthProvider necesita GlobalStateProvider porque usa useAppState() internamente
 * - Por eso GlobalStateProvider debe estar fuera (envuelve AuthProvider)
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provider del estado global - debe estar más afuera */}
    <GlobalStateProvider>
      {/* Provider de autenticación - usa GlobalStateProvider internamente */}
      <AuthProvider>
        {/* Componente principal de la aplicación */}
        <App />
      </AuthProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
)

