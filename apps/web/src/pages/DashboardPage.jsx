/**
 * DashboardPage.jsx - PÁGINA PRINCIPAL DEL DASHBOARD
 * 
 * Esta es la página principal que se muestra después de que el usuario inicia sesión.
 * Contiene el layout general (header, main, footer) y renderiza el dashboard
 * específico según el rol del usuario.
 * 
 * Ruta: /dashboard (definida en AppRouter.jsx)
 * Protección: ProtectedRoute (solo visible si estás autenticado)
 * 
 * Características:
 * - Header con logo y botón de cerrar sesión
 * - Main con el dashboard específico por rol (RoleDashboard)
 * - Footer con información del usuario
 */

// useAppState: Hook para acceder al estado global de la aplicación
import { useAppState } from '@core-logic/context/GlobalStateContext';

// useAuth: Hook para acceder a las funciones de autenticación
import { useAuth } from '@core-logic/context/AuthContext';

// RoleDashboard: Componente que renderiza el dashboard según el rol del usuario
import RoleDashboard from '../components/RoleDashboard';

// Estilos específicos de la página Dashboard
import './DashboardPage.css';

/**
 * DashboardPage - Página principal para usuarios autenticados
 * 
 * @returns {JSX.Element} Layout completo del dashboard con header, main y footer
 * 
 * Estructura:
 * - Header: Logo, título y botón de cerrar sesión
 * - Main: Dashboard específico por rol (Solicitante, Proveedor de Servicio, Proveedor de Insumos)
 * - Footer: Información del rol del usuario y estado de autenticación
 */
const DashboardPage = () => {
  // Obtiene el estado global de la aplicación
  // state.currentUser contiene la información del usuario autenticado
  const { state } = useAppState();
  
  // Obtiene la función logout del contexto de autenticación
  const { logout } = useAuth();

  /**
   * Maneja el cierre de sesión del usuario
   * 
   * Esta función:
   * 1. Llama a logout() que limpia el usuario del estado global
   * 2. Elimina el usuario de localStorage
   * 3. Redirige automáticamente a /login (manejado por ProtectedRoute)
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-page">
      {/* Header: Barra superior con logo y botón de cerrar sesión */}
      <header className="dashboard-header">
        <div className="header-content">
          {/* Brand: Logo y título de la aplicación */}
          <div className="dashboard-brand">
            <h1 className="dashboard-logo">MARKET DEL ESTE</h1>
            <p className="dashboard-tagline">Marketplace de Punta del Este</p>
          </div>
          
          {/* Acciones del header: Botón de cerrar sesión */}
          <div className="header-actions">
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main: Contenido principal del dashboard */}
      <main className="dashboard-main">
        {/* 
          RoleDashboard: Renderiza el dashboard específico según el rol del usuario
          - Si es "Solicitante" → SolicitanteDashboard
          - Si es "Proveedor de Servicio" → ProveedorServicioDashboard
          - Si es "Proveedor de Insumos" → ProveedorInsumosDashboard
          
          Esto implementa el control de acceso por rol (F1.HU3)
        */}
        <RoleDashboard />
      </main>

      {/* Footer: Información del usuario y estado de autenticación */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p className="footer-brand">MARKET DEL ESTE</p>
          {/* 
            Muestra el rol del usuario actual y confirma que está autenticado
            state.currentUser?.role usa optional chaining (?.) para evitar errores
            si currentUser es null
          */}
          <p className="footer-info">Rol: {state.currentUser?.role} | Autenticación activa</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;

