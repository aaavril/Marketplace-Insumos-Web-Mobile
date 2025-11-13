import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/GlobalStateContext';
import SupplyOfferForm from './SupplyOfferForm';
import './RoleDashboard.css';

/**
 * Dashboard específico para Solicitantes
 * Muestra funcionalidades relevantes para usuarios que solicitan servicios
 */
const SolicitanteDashboard = () => {
  const { state } = useAppState();
  const navigate = useNavigate();

  const handlePublicarServicio = () => {
    navigate('/services/create');
  };

  const myServices = state.services.filter(
    (service) => service.solicitanteId === state.currentUser.id
  );

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Solicitante</h2>
        <p>Gestiona tus solicitudes de servicio en Market del Este</p>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handlePublicarServicio}
          className="action-btn primary-btn"
        >
          Publicar Solicitud de Servicio
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h3>Mis Solicitudes Activas</h3>
          {myServices.length > 0 ? (
            <div className="services-list">
              {myServices.map((service) => (
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
                  <div className="service-item-footer">
                    <div className="chips-group">
                      <span className="quote-chip">
                        {(service.quotes && service.quotes.length) || 0} cotizaciones
                      </span>
                      <span className="offer-chip">
                        {state.supplyOffers?.length || 0} packs de insumos
                      </span>
                    </div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      Ver detalle →
                    </button>
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

      </div>
    </div>
  );
};

/**
 * Dashboard específico para Proveedores de Servicio
 * Muestra funcionalidades para usuarios que ofrecen servicios
 */
const ProveedorServicioDashboard = () => {
  const { state } = useAppState();
  const navigate = useNavigate();

  const handleVerServicios = () => {
    navigate('/services');
  };

  const handleVerHistorial = () => {
    // TODO: Implementar historial de servicios atendidos por el proveedor
    alert('Historial de servicios - Próximamente disponible');
  };

  const myServices = state.services.filter((service) =>
    service.quotes?.some((quote) => quote.serviceProviderId === state.currentUser.id)
  );

  const myQuotes = state.quotes
    ?.filter((quote) => quote.serviceProviderId === state.currentUser.id)
    .map((quote) => {
      const service = state.services.find((s) => s.id === quote.serviceId);
      return {
        ...quote,
        serviceTitle: service?.title ?? 'Servicio',
        serviceStatus: service?.status ?? 'En revisión',
        serviceLocation: service?.location ?? ''
      };
    }) ?? [];

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Proveedor de Servicio</h2>
        <p>Gestiona tus servicios y cotizaciones en Market del Este</p>
      </div>

      <div className="dashboard-actions">
        <button 
          onClick={handleVerServicios}
          className="action-btn primary-btn"
        >
          Ver servicios disponibles
        </button>
        <button
          onClick={handleVerHistorial}
          className="action-btn secondary-btn"
        >
          Ver historial de servicios
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h3>Mis servicios activos</h3>
          {myServices.length > 0 ? (
            <div className="services-list">
              {myServices.map((service) => (
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
                  <div className="service-item-footer">
                    <div className="chips-group">
                      <span className="quote-chip">
                        {service.quotes?.filter(q => q.serviceProviderId === state.currentUser.id).length || 0} mis cotizaciones
                      </span>
                      <span className="offer-chip">
                        {state.supplyOffers?.length || 0} packs de insumos
                      </span>
                    </div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      Ver detalle →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Aún no has cotizado ningún servicio.</p>
              <button onClick={handleVerServicios} className="link-btn">
                Buscar servicios para cotizar
              </button>
            </div>
          )}
        </div>

        <div className="content-section">
          <h3>Mis cotizaciones</h3>
          {myQuotes.length > 0 ? (
            <ul className="quotes-overview">
              {myQuotes.map((quote) => (
                <li key={quote.id} className="quotes-overview-item">
                  <div>
                    <h4>{quote.serviceTitle}</h4>
                    <p>
                      Oferta: <strong>USD {quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</strong>
                    </p>
                    <p className="quote-meta">
                      ⏳ Plazo: {quote.deadline} · Estado del servicio: {quote.serviceStatus}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => navigate(`/services/${quote.serviceId}`)}
                  >
                    Ver detalle →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>Aún no has enviado cotizaciones.</p>
              <button onClick={handleVerServicios} className="link-btn">
                Buscar servicios para cotizar
              </button>
            </div>
          )}
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
  const { state } = useAppState();
  const navigate = useNavigate();

  const myOffers = state.supplyOffers.filter(
    (offer) => offer.providerId === state.currentUser.id
  );

  const handleVerServicios = () => {
    navigate('/services');
  };

  return (
    <div className="role-dashboard">
      <div className="dashboard-header">
        <h2>Dashboard Proveedor de Insumos</h2>
        <p>Gestiona tus packs de insumos en Market del Este</p>
      </div>

      <div className="dashboard-content supply-dashboard">
        <div className="content-section">
          <SupplyOfferForm />
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3>Mis Ofertas Publicadas</h3>
            <button onClick={handleVerServicios} className="link-btn">
              Ver servicios publicados
            </button>
          </div>

          {myOffers.length > 0 ? (
            <div className="offers-list">
              {myOffers.map((offer) => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-header">
                    <h4>{offer.title}</h4>
                    <span className="offer-price">
                      USD {offer.totalPrice.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {offer.description && (
                    <p className="offer-description">{offer.description}</p>
                  )}
                  <div className="offer-items">
                    <h5>Insumos incluidos:</h5>
                    <ul>
                      {offer.items.map((item, index) => (
                        <li key={index}>
                          <strong>{item.name}</strong>
                          {(item.quantity || item.unit) && (
                            <span>
                              {' '}- {item.quantity ? item.quantity : ''}
                              {item.unit ? ` ${item.unit}` : ''}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No tienes ofertas publicadas</p>
              <span className="hint-text">
                Crea tu primera oferta usando el formulario.
              </span>
            </div>
          )}
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


