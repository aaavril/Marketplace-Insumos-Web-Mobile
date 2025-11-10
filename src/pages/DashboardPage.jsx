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
            <span className="user-greeting">Hola, {state.currentUser?.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Dashboard específico por rol - Control de Acceso (F1.HU3) */}
        <RoleDashboard />

        {/* Vista para otros roles (Proveedores) */}
        {state.currentUser?.role !== 'Solicitante' && (
          <section className="info-card">
            <h2>Bienvenido, {state.currentUser?.name}</h2>
            <p>La vista para {state.currentUser?.role} se implementará próximamente.</p>
          </section>
        )}

        {/* Panel de estadísticas generales */}
        <section className="info-card">
          <h2>Estadísticas Generales</h2>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Usuarios Registrados:</span>
              <span className="stat-value">{state.users.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Servicios:</span>
              <span className="stat-value">{state.services.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cotizaciones:</span>
              <span className="stat-value">{state.quotes.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ofertas de Insumos:</span>
              <span className="stat-value">{state.supplyOffers.length}</span>
            </div>
          </div>
        </section>
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

