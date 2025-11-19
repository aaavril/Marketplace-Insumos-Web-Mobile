/**
 * App.jsx - COMPONENTE RAÍZ DE LA APLICACIÓN
 * 
 * Este es el componente principal que se renderiza dentro del <div id="root">.
 * Su función principal es renderizar el AppRouter, que maneja toda la navegación.
 * 
 * Este componente es simple porque toda la lógica está delegada:
 * - Navegación → AppRouter.jsx
 * - Estado global → GlobalStateProvider (en main.jsx)
 * - Autenticación → AuthProvider (en main.jsx)
 * - Componentes de página → Se renderizan según la ruta actual
 * 
 * Flujo:
 * main.jsx renderiza <App /> → App renderiza <AppRouter /> → AppRouter renderiza la página según la ruta
 */

// Router principal que maneja todas las rutas de la aplicación
import AppRouter from './router/AppRouter';

// Estilos específicos del componente App (CSS)
import './App.css'

/**
 * Componente App - Componente raíz de la aplicación
 * 
 * @returns {JSX.Element} Renderiza el AppRouter con todas las rutas configuradas
 * 
 * Este componente:
 * 1. Se renderiza una vez cuando la app inicia
 * 2. Renderiza el AppRouter que maneja qué página mostrar según la URL
 * 3. Todas las páginas y componentes se renderizan como hijos del AppRouter
 */
function App() {
  // Renderiza el router que maneja la navegación de toda la aplicación
  return <AppRouter />;
}

// Exporta el componente para que pueda ser importado en main.jsx
export default App

