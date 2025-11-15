import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/GlobalStateContext';
import { useMemo, useState } from 'react';
import './RoleDashboard.css';

const getStatusClass = (status) =>
  status
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

const getRatingLabel = (rating) => {
  if (rating == null) return null;
  const labels = {
    5: '⭐⭐⭐⭐⭐ Excelente',
    4: '⭐⭐⭐⭐ Muy bueno',
    3: '⭐⭐⭐ Bueno',
    2: '⭐⭐ Regular',
    1: '⭐ Deficiente',
  };
  return labels[rating] || `${rating}/5`;
};

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

  const myAllServices = state.services.filter(
    (service) => service.solicitanteId === state.currentUser.id
  );

  const [serviceFilter, setServiceFilter] = useState('todos');

  const totalServices = myAllServices.length;
  const finalizedCount = myAllServices.filter((service) => {
    const status = service.status.toLowerCase();
    return status.includes('finalizado') || status.includes('completado');
  }).length;
  const inProgressCount = totalServices - finalizedCount;

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'activos', label: 'Activos' },
    { key: 'solicitados', label: 'Solicitados' },
    { key: 'en-curso', label: 'En curso' },
    { key: 'finalizados', label: 'Finalizados' },
  ];

  const getProviderName = (providerId) => {
    const provider = state.users.find((user) => user.id === providerId);
    return provider ? provider.name : 'Proveedor';
  };

  const getAssignedProviderName = (service) => {
    if (!service.selectedQuoteId) return null;
    const selectedQuote = service.quotes?.find((quote) => quote.id === service.selectedQuoteId);
    return selectedQuote ? getProviderName(selectedQuote.serviceProviderId) : null;
  };

  const filteredServices = myAllServices.filter((service) => {
    const normalizedStatus = service.status.toLowerCase();

    switch (serviceFilter) {
      case 'activos':
        return !normalizedStatus.includes('finalizado') && !normalizedStatus.includes('completado');
      case 'solicitados':
        return normalizedStatus === 'publicado';
      case 'en-curso':
        return normalizedStatus === 'en evaluación' || normalizedStatus === 'asignado';
      case 'finalizados':
        return normalizedStatus.includes('finalizado') || normalizedStatus.includes('completado');
      case 'todos':
      default:
        return true;
    }
  });

  const orderedServices = useMemo(() => {
    if (serviceFilter !== 'todos') {
      return filteredServices;
    }

    const getWeight = (service) => {
      const status = service.status.toLowerCase();
      return status.includes('finalizado') || status.includes('completado') ? 1 : 0;
    };

    return [...filteredServices].sort((a, b) => {
      const diff = getWeight(a) - getWeight(b);
      if (diff !== 0) return diff;
      return 0;
    });
  }, [filteredServices, serviceFilter]);

  return (
    <div className="role-dashboard solicitante-dashboard">
      <div className="dashboard-header white-panel with-actions">
        <div>
          <h2>Gestiona tus solicitudes de servicio en MARKET DEL ESTE</h2>
        </div>
      </div>
      <div className="header-actions inline">
        <button onClick={handlePublicarServicio} className="action-btn primary-btn compact">
          Publicar servicio
        </button>
      </div>

      <div className="services-summary below-actions">
        <div className="summary-card">
          <span>Total solicitados</span>
          <strong>{totalServices}</strong>
        </div>
        <div className="summary-card">
          <span>En curso</span>
          <strong>{inProgressCount}</strong>
        </div>
        <div className="summary-card">
          <span>Finalizados</span>
          <strong>{finalizedCount}</strong>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="services-filter-header">
            <h3>Servicios</h3>
            <div className="filter-pills">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`filter-pill ${serviceFilter === key ? 'active' : ''}`}
                  onClick={() => setServiceFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {orderedServices.length > 0 ? (
            <div className="services-list condensed">
              {orderedServices.map((service) => (
                <div key={service.id} className="service-item compact">
                  <div className="service-summary">
                    <h4>{service.title}</h4>
                  </div>
                  <p className="service-short">{service.description}</p>
                  <div className="service-meta mini">
                    <span>📅 {service.date}</span>
                    <span>📍 {service.location}</span>
                  </div>
                  {getAssignedProviderName(service) && (
                    <div className="service-meta provider-chip mini">
                      <span>👷 Prestador: {getAssignedProviderName(service)}</span>
                    </div>
                  )}
                  {service.rating != null && (
                    <div className="service-rating-chip small">
                      ⭐ {getRatingLabel(service.rating)}
                    </div>
                  )}
                  <div className="service-item-footer">
                    <div className="chips-group">
                      <span className="quote-chip">
                        {(service.quotes && service.quotes.length) || 0} cotizaciones
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
              <p>No hay servicios para el filtro seleccionado.</p>
              <button onClick={handlePublicarServicio} className="link-btn">
                Publicar nuevo servicio
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

  const handlePublicarServicio = () => {
    navigate('/services/create');
  };

  const providerServices = useMemo(
    () =>
      state.services.filter((service) =>
        service.quotes?.some((quote) => quote.serviceProviderId === state.currentUser.id)
      ),
    [state.services, state.currentUser.id]
  );

  const providerQuotes =
    state.quotes?.filter((quote) => quote.serviceProviderId === state.currentUser.id) ?? [];

  const [serviceFilter, setServiceFilter] = useState('todos');

  const cotizadosCount = providerServices.length;
  const asignadosCount = providerServices.filter((service) => service.status === 'Asignado').length;
  const finalizadosCount = providerServices.filter((service) => {
    const normalized = service.status.toLowerCase();
    return normalized.includes('finalizado') || normalized.includes('completado');
  }).length;
  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'cotizados', label: 'Cotizados' },
    { key: 'asignados', label: 'Asignados' },
    { key: 'finalizados', label: 'Finalizados' },
  ];

  const getMyQuoteForService = (service) =>
    service.quotes?.find((quote) => quote.serviceProviderId === state.currentUser.id);

  const filteredServices = providerServices.filter((service) => {
    const normalizedStatus = service.status.toLowerCase();

    switch (serviceFilter) {
      case 'activos':
        return true;
      case 'cotizados':
        return true;
      case 'asignados':
        return normalizedStatus === 'asignado';
      case 'finalizados':
        return normalizedStatus.includes('finalizado') || normalizedStatus.includes('completado');
      case 'todos':
      default:
        return true;
    }
  });

  const orderedServices = useMemo(() => {
    if (serviceFilter !== 'todos') {
      return filteredServices;
    }
    const getWeight = (service) => {
      const normalized = service.status.toLowerCase();
      if (normalized.includes('finalizado') || normalized.includes('completado')) return 2;
      if (normalized === 'asignado') return 1;
      return 0;
    };
    return [...filteredServices].sort((a, b) => getWeight(a) - getWeight(b));
  }, [filteredServices, serviceFilter]);

  return (
    <div className="role-dashboard provider-dashboard">
      <div className="dashboard-header white-panel">
        <div className="dashboard-heading">
          <h2>Gestiona tus servicios como proveedor</h2>
          <p>Monitorea tus cotizaciones y el estado de cada servicio en curso.</p>
        </div>
      </div>
      <div className="header-actions inline">
        <button onClick={handleVerServicios} className="action-btn primary-btn compact">
          Ver servicios disponibles
        </button>
      </div>

      <div className="services-summary below-actions">
        <div className="summary-card">
          <span>Total gestionados</span>
          <strong>{providerServices.length}</strong>
        </div>
        <div className="summary-card">
          <span>Cotizados</span>
          <strong>{cotizadosCount}</strong>
        </div>
        <div className="summary-card">
          <span>Asignados</span>
          <strong>{asignadosCount}</strong>
        </div>
        <div className="summary-card">
          <span>Finalizados</span>
          <strong>{finalizadosCount}</strong>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="services-filter-header">
            <h3>Servicios gestionados</h3>
            <div className="filter-pills">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={`filter-pill ${serviceFilter === key ? 'active' : ''}`}
                  onClick={() => setServiceFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {orderedServices.length > 0 ? (
            <div className="services-list condensed">
              {orderedServices.map((service) => {
                const myQuote = getMyQuoteForService(service);
                return (
                  <div key={service.id} className="service-item compact">
                    <div className="service-summary">
                      <h4>{service.title}</h4>
                    </div>
                    <p className="service-short">{service.description}</p>
                    <div className="service-meta mini">
                      <span>📅 {service.date}</span>
                      <span>📍 {service.location}</span>
                      {myQuote?.deadline && <span>⏳ {myQuote.deadline}</span>}
                    </div>
                    {myQuote && (
                      <div className="service-meta provider-chip mini">
                        <span>
                          💰 Mi oferta:{' '}
                          {`USD ${myQuote.price.toLocaleString('es-UY', {
                            minimumFractionDigits: 2,
                          })}`}
                        </span>
                      </div>
                    )}
                    {service.rating != null && (
                      <div className="service-rating-chip small">
                        ⭐ {getRatingLabel(service.rating)}
                      </div>
                    )}
                    <div className="service-item-footer">
                      <div className="chips-group">
                        <span className="quote-chip">
                          {myQuote ? 'Cotización enviada' : 'Sin cotización'}
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
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay servicios para el filtro seleccionado.</p>
              <button onClick={handleVerServicios} className="link-btn">
                Buscar servicios disponibles
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

  const handlePublicarPack = () => {
    navigate('/supplies/create');
  };

  return (
    <div className="role-dashboard">
      <div className="dashboard-header white-panel with-actions">
        <div className="dashboard-heading">
          <h2>Gestiona tus packs de insumos</h2>
          <p>Centraliza tus ofertas publicadas y mantenlas actualizadas.</p>
        </div>
      </div>
      <div className="header-actions inline">
        <button onClick={handlePublicarPack} className="action-btn primary-btn compact">
          Publicar pack de insumos
        </button>
      </div>

      <div className="dashboard-content supply-dashboard single-column">
        <div className="content-section">
          <div className="section-header">
            <h3>Mis Ofertas Publicadas</h3>
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
                Crea tu primera oferta usando el botón de arriba.
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


