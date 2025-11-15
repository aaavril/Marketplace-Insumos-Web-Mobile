import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/GlobalStateContext';
import './ServicesListPage.css';
import './ServiceHistoryPage.css';

/**
 * ServiceHistoryPage
 * Página que muestra el historial de servicios cotizados por el proveedor
 * (F3 complemento: seguimiento de propuestas realizadas)
 */
const ServiceHistoryPage = () => {
  const navigate = useNavigate();
  const { state } = useAppState();

  const currentUserId = state.currentUser?.id;

  const getStatusClass = (status) =>
    status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

  const historyServices = useMemo(() => {
    if (!currentUserId) {
      return [];
    }

    return state.services
      .map((service) => {
        const myQuotes = service.quotes?.filter(
          (quote) => quote.serviceProviderId === currentUserId
        ) ?? [];

        if (myQuotes.length === 0) {
          return null;
        }

        const latestQuoteTimestamp = myQuotes.reduce((latest, quote) => {
          const current = new Date(quote.createdAt || service.updatedAt || service.date).getTime();
          return current > latest ? current : latest;
        }, 0);

        return {
          service,
          myQuotes,
          latestQuoteTimestamp,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.latestQuoteTimestamp - a.latestQuoteTimestamp);
  }, [state.services, currentUserId]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const formatPrice = (value) =>
    `USD ${Number(value).toLocaleString('es-UY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const ratingLabels = {
    5: '⭐⭐⭐⭐⭐ Excelente',
    4: '⭐⭐⭐⭐ Muy bueno',
    3: '⭐⭐⭐ Bueno',
    2: '⭐⭐ Regular',
    1: '⭐ Deficiente',
  };

  const formatQuoteDate = (value) => {
    if (!value) return 'Fecha no disponible';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }
    return date.toLocaleDateString('es-UY');
  };

  return (
    <div className="service-history-page">
      <div className="page-header">
        <div className="header-top">
          <button onClick={handleBack} className="btn-back">
            ← Volver al Dashboard
          </button>
          <div className="page-brand">
            <span className="brand-name">MARKET DEL ESTE</span>
          </div>
        </div>
        <div className="header-content">
          <h1>Historial de Servicios</h1>
          <p className="page-subtitle">
            Revisa las cotizaciones que enviaste y el estado actual de cada servicio
          </p>
        </div>
      </div>

      <div className="history-content">
        {historyServices.length > 0 ? (
          <div className="history-grid">
            {historyServices.map(({ service, myQuotes }) => {
              const selectedQuoteId = service.selectedQuoteId;

              return (
                <div key={service.id} className="history-card">
                  <div className="history-card-header">
                    <h3>{service.title}</h3>
                    <span className={`status-badge ${getStatusClass(service.status)}`}>
                      {service.status}
                    </span>
                  </div>

                  <p className="history-description">{service.description}</p>

                  <div className="history-meta">
                    <span>📍 {service.location}</span>
                    <span>📅 {service.date}</span>
                    <span>
                      📄 {service.quotes?.length || 0} cotizaciones totales
                    </span>
                  </div>

                  {service.rating != null && (
                    <div className="history-rating">
                      ⭐ Valoración otorgada: {ratingLabels[service.rating] || `${service.rating}/5`}
                    </div>
                  )}

                  <div className="history-quotes">
                    <h4>Mis cotizaciones</h4>
                    {myQuotes.map((quote) => {
                      const formattedDate = formatQuoteDate(quote.createdAt);
                      const isSelected = selectedQuoteId === quote.id;

                      return (
                        <div
                          key={quote.id}
                          className={`history-quote ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="quote-info">
                            <span className="quote-price">{formatPrice(quote.price)}</span>
                            <span className="quote-deadline">
                              ⏳ Plazo estimado: {quote.deadline}
                            </span>
                          </div>
                          {quote.notes && (
                            <p className="quote-notes">{quote.notes}</p>
                          )}
                          <span className="quote-date">
                            {formattedDate === 'Fecha no disponible'
                              ? formattedDate
                              : `Enviada el ${formattedDate}`}
                          </span>
                          {isSelected && (
                            <span className="history-selected-badge">
                              {service.status === 'Completado'
                                ? `Completado${
                                    service.rating
                                      ? ` · ${ratingLabels[service.rating] || `${service.rating}/5`}`
                                      : ''
                                  }`
                                : 'Asignado'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="history-card-footer">
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
          <div className="history-empty">
            <div className="empty-card">
              <div className="empty-icon">🗂️</div>
              <h3>No tienes historial todavía</h3>
              <p>
                Una vez que envíes cotizaciones, podrás hacer seguimiento desde aquí.
              </p>
              <button onClick={() => navigate('/services')} className="btn-primary">
                Explorar servicios disponibles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistoryPage;


