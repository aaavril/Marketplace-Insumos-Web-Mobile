import { useAppState } from './context/GlobalStateContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './App.css'

/**
 * Componente principal de la aplicación
 * Implementa control de acceso basado en autenticación
 */
function App() {
  const { state } = useAppState();

  // Si no hay usuario autenticado, muestra LoginPage
  if (!state.currentUser) {
    return <LoginPage />;
  }

  // Si hay usuario autenticado, muestra DashboardPage
  return <DashboardPage />;
}

export default App

