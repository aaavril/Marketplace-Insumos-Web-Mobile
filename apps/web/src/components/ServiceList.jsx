import { useNavigate } from 'react-router-dom';
import { useAppState } from '@core-logic/context/GlobalStateContext';
import './ServiceList.css';

/**
 * ServiceList - Componente que muestra la lista de servicios publicados
 * Filtra servicios por status === 'Publicado' para que Proveedores de Servicio puedan verlos
 */
const ServiceList = () => {
  const navigate = useNavigate();
  const { state } = useAppState();

  // Filtrar servicios publicados (F2.HU3: status === 'Publicado')
  const publishedServices = state.services.filter(
    service => service.status === 'Publicado'
  );

  /**
   * Obtiene el nombre del solicitante por su ID
   */
  const getSolicitanteName = (solicitanteId) => {
    const solicitante = state.users.find(user => user.id === solicitanteId);
    return solicitante ? solicitante.name : 'Usuario desconocido';
  };

  if (publishedServices.length === 0) {
    return (
      <div className="service-list-container">
        <div className="empty-services">
          <div className="empty-icon">📋</div>
          <h3>No hay servicios publicados</h3>
          <p>Actualmente no hay servicios disponibles para cotizar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-list-container">
      <div className="services-grid">
        {publishedServices.map(service => (
          <div key={service.id} className="service-list-card">
            <div className="service-card-header">
              <h3 className="service-title">{service.title}</h3>
              <span className="service-status-badge published">
                {service.status}
              </span>
            </div>

            <p className="service-description">{service.description}</p>

            <div className="service-details">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{service.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-text">{service.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <span className="detail-text">
                  {getSolicitanteName(service.solicitanteId)}
                </span>
              </div>
            </div>

            {/* Mostrar insumos requeridos si existen */}
            {service.requiredSupplies && service.requiredSupplies.length > 0 && (
              <div className="supplies-section">
                <h4 className="supplies-title">Insumos Requeridos:</h4>
                <div className="supplies-list">
                  {service.requiredSupplies.map((supply, index) => (
                    <div key={index} className="supply-tag">
                      {supply.name}
                      {supply.quantity && ` (${supply.quantity}`}
                      {supply.quantity && supply.unit && ` ${supply.unit})`}
                      {supply.quantity && !supply.unit && ')'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="service-card-footer">
              <div className="quotes-info">
                <span className="quotes-count">
                  {service.quotes?.length || 0} cotizaciones
                </span>
              </div>
              <button
                onClick={() => navigate(`/services/${service.id}`)}
                className="btn-quote"
              >
                Ver detalle y cotizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;

