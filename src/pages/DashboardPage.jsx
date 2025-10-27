import { useAppState } from '../context/GlobalStateContext';
import RoleDashboard from '../components/dashboard/RoleDashboard';
import './DashboardPage.css';

/**
 * DashboardPage - Página principal para usuarios autenticados
 */
const DashboardPage = () => {
  const { state, dispatch } = useAppState();

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Marketplace de Servicios con Insumos</h1>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Dashboard específico por rol - Control de Acceso (F1.HU3) */}
        <RoleDashboard />

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
        <p>Autenticación activa | Control de permisos funcionando | Rol: {state.currentUser.role}</p>
      </footer>
    </div>
  );
};

export default DashboardPage;

