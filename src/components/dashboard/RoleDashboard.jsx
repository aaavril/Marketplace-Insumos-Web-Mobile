import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/GlobalStateContext';
import './RoleDashboard.css';

/**
 * Dashboard específico para Solicitantes
 * Muestra funcionalidades relevantes para usuarios que solicitan servicios
 */
const SolicitanteDashboard = () => {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();

  const handlePublicarServicio = () => {
    navigate('/services/create');
  };

  const handleVerProveedores = () => {
    // TODO: Implementar listado de proveedores
    alert('Funcionalidad: Ver Proveedores Disponibles - Próximamente');
  };

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Solicitante</h2>
        <p>Gestiona tus solicitudes de servicio</p>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handlePublicarServicio}
          className="action-btn primary-btn"
        >
          Publicar Solicitud de Servicio
        </button>
        
        <button 
          onClick={handleVerProveedores}
          className="action-btn secondary-btn"
        >
          Ver Proveedores Disponibles
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h3>Mis Solicitudes Activas</h3>
          {state.services.filter(s => s.solicitanteId === state.currentUser.id).length > 0 ? (
            <div className="services-list">
              {state.services
                .filter(s => s.solicitanteId === state.currentUser.id)
                .map(service => (
                  <div key={service.id} className="service-item">
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                    <div className="service-meta">
                      <span>📍 {service.location}</span>
                      <span>📅 {service.date}</span>
                      <span className={`status-badge ${service.status.toLowerCase()}`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tienes solicitudes activas</p>
              <button onClick={handlePublicarServicio} className="link-btn">
                Crear tu primera solicitud
              </button>
            </div>
          )}
        </div>

        <div className="content-section">
          <h3>Cotizaciones Recibidas</h3>
          <div className="empty-state">
            <p>No tienes cotizaciones pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Dashboard específico para Proveedores de Servicio
 * Muestra funcionalidades para usuarios que ofrecen servicios
 */
const ProveedorServicioDashboard = () => {
  const { state, dispatch } = useAppState();

  const handleVerServicios = () => {
    // TODO: Implementar listado de servicios publicados
    alert('Funcionalidad: Ver Servicios Publicados - Próximamente');
  };

  const handleGestionarServicios = () => {
    // TODO: Implementar gestión de servicios propios
    alert('Funcionalidad: Gestionar Mis Servicios - Próximamente');
  };

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Proveedor de Servicio</h2>
        <p>Gestiona tus servicios y cotizaciones</p>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handleVerServicios}
          className="action-btn primary-btn"
        >
          Ver Servicios Publicados
        </button>
        
        <button 
          onClick={handleGestionarServicios}
          className="action-btn secondary-btn"
        >
          Gestionar Mis Servicios
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h3>Servicios Disponibles</h3>
          <div className="empty-state">
            <p>No hay servicios publicados</p>
            <button onClick={handleVerServicios} className="link-btn">
              Ver todos los servicios
            </button>
          </div>
        </div>

        <div className="content-section">
          <h3>Mis Cotizaciones Enviadas</h3>
          <div className="empty-state">
            <p>No has enviado cotizaciones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Dashboard específico para Proveedores de Insumos
 * Muestra funcionalidades para usuarios que ofrecen insumos
 */
const ProveedorInsumosDashboard = () => {
  const { state, dispatch } = useAppState();

  const handlePublicarInsumos = () => {
    // TODO: Implementar formulario para publicar ofertas de insumos
    alert('Funcionalidad: Publicar Oferta de Insumos - Próximamente');
  };

  const handleGestionarInventario = () => {
    // TODO: Implementar gestión de inventario
    alert('Funcionalidad: Gestionar Inventario - Próximamente');
  };

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Proveedor de Insumos</h2>
        <p>Gestiona tu inventario y ofertas</p>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handlePublicarInsumos}
          className="action-btn primary-btn"
        >
          Publicar Oferta de Insumos
        </button>
        
        <button 
          onClick={handleGestionarInventario}
          className="action-btn secondary-btn"
        >
          Gestionar Inventario
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h3>Mis Ofertas Activas</h3>
          <div className="empty-state">
            <p>No tienes ofertas activas</p>
            <button onClick={handlePublicarInsumos} className="link-btn">
              Crear tu primera oferta
            </button>
          </div>
        </div>

        <div className="content-section">
          <h3>Solicitudes de Insumos</h3>
          <div className="empty-state">
            <p>No hay solicitudes de insumos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente principal que renderiza el dashboard según el rol del usuario
 * Implementa el control de acceso por rol (F1.HU3)
 */
const RoleDashboard = () => {
  const { state } = useAppState();

  // Renderizado condicional basado en el rol del usuario
  if (state.currentUser.role === 'Solicitante') {
    return <SolicitanteDashboard />;
  }

  if (state.currentUser.role === 'Proveedor de Servicio') {
    return <ProveedorServicioDashboard />;
  }

  if (state.currentUser.role === 'Proveedor de Insumos') {
    return <ProveedorInsumosDashboard />;
  }

  // Fallback para roles no reconocidos
  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Rol no reconocido: {state.currentUser.role}</p>
      </div>
    </div>
  );
};

export default RoleDashboard;


