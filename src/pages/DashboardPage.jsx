import { useAppState } from '../context/GlobalStateContext';
import { useAuth } from '../context/AuthContext';
import RoleDashboard from '../components/RoleDashboard';
import './DashboardPage.css';

/**
 * DashboardPage - Página principal para usuarios autenticados
 */
const DashboardPage = () => {
  const { state } = useAppState();
  const { logout } = useAuth();

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="dashboard-brand">
            <h1 className="dashboard-logo">Market del Este</h1>
            <p className="dashboard-tagline">Marketplace de Punta del Este</p>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Dashboard específico por rol - Control de Acceso (F1.HU3) */}
        <RoleDashboard />

      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p className="footer-brand">Market del Este</p>
          <p className="footer-info">Rol: {state.currentUser?.role} | Autenticación activa</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;

