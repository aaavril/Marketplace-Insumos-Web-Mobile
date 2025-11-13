import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../context/GlobalStateContext';
import { useAuth } from '../context/AuthContext';
import QuoteForm from '../components/QuoteForm';
import './ServiceDetailPage.css';

/**
 * ServiceDetailPage - Muestra el detalle de un servicio publicado
 * Permite a los Proveedores de Servicio enviar una cotización (F3.HU1)
 */
const ServiceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useAppState();
  const { user } = useAuth();

  const service = useMemo(
    () => state.services.find((item) => item.id === id),
    [state.services, id]
  );

  const supplyOffers = state.supplyOffers || [];

  const solicitanteName = useMemo(() => {
    if (!service) return '';
    const solicitante = state.users.find((u) => u.id === service.solicitanteId);
    return solicitante ? solicitante.name : 'Solicitante';
  }, [service, state.users]);

  const getProviderName = (providerId) => {
    const provider = state.users.find((u) => u.id === providerId);
    return provider ? provider.name : 'Proveedor';
  };

  const handleBack = () => {
    navigate('/services');
  };

  if (!service) {
    return (
      <div className="service-detail-page">
        <div className="detail-card not-found">
          <h1>Servicio no encontrado</h1>
          <p>El servicio que buscas no está disponible o ha sido eliminado.</p>
          <button onClick={handleBack} className="btn-back">
            ← Volver a servicios
          </button>
        </div>
      </div>
    );
  }

  const isServiceProvider = user?.role === 'Proveedor de Servicio';
  const isSolicitante = user?.id && service?.solicitanteId === user.id;

  return (
    <div className="service-detail-page">
      <div className="detail-header">
        <button onClick={handleBack} className="btn-back">
          ← Volver a servicios
        </button>
        <div className="detail-brand">
          <span className="brand-name">Market del Este</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-card service-info">
          <div className="service-header">
            <h1>{service.title}</h1>
            <span className={`service-status ${service.status.toLowerCase()}`}>
              {service.status}
            </span>
          </div>

          <p className="service-description">{service.description}</p>

          <div className="service-meta">
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <span className="meta-label">Ubicación</span>
              <span className="meta-value">{service.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-label">Fecha deseada</span>
              <span className="meta-value">{service.date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">👤</span>
              <span className="meta-label">Solicitante</span>
              <span className="meta-value">{solicitanteName}</span>
            </div>
          </div>

          {service.requiredSupplies?.length > 0 && (
            <div className="supplies-section">
              <h2>Insumos requeridos</h2>
              <div className="supplies-grid">
                {service.requiredSupplies.map((supply, index) => (
                  <div key={index} className="supply-item">
                    <span className="supply-name">{supply.name}</span>
                    {(supply.quantity || supply.unit) && (
                      <span className="supply-meta">
                        {supply.quantity && `${supply.quantity}`}
                        {supply.unit && ` ${supply.unit}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isSolicitante && (
            <div className="quotes-section solicitante-view">
              <h2>Cotizaciones recibidas</h2>
              {service.quotes && service.quotes.length > 0 ? (
                <ul className="quotes-list">
                  {service.quotes.map((quote) => (
                    <li key={quote.id} className="quote-item">
                      <div className="quote-header">
                        <span className="quote-provider">
                          {getProviderName(quote.serviceProviderId)}
                        </span>
                        <span className="quote-price">
                          USD {quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="quote-deadline">
                        <span className="meta-icon">⏳</span>
                        <span>Plazo estimado: {quote.deadline}</span>
                      </div>
                      {quote.notes && (
                        <p className="quote-notes">{quote.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="quote-empty">
                  <p>Todavía no hay cotizaciones para este servicio.</p>
                </div>
              )}
            </div>
          )}

          <div className="supply-offers-section">
            <h2>Packs de insumos disponibles</h2>
            {supplyOffers.length > 0 ? (
              <div className="offers-catalog">
                {supplyOffers.map((offer) => (
                  <div key={offer.id} className="offer-card">
                    <div className="offer-header">
                      <div>
                        <h3>{offer.title}</h3>
                        <span className="offer-provider">
                          Ofrecido por {offer.providerName || getProviderName(offer.providerId)}
                        </span>
                      </div>
                      <span className="offer-price">
                        USD {offer.totalPrice.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {offer.description && (
                      <p className="offer-description">{offer.description}</p>
                    )}
                    <div className="offer-items">
                      <h4>Insumos incluidos</h4>
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
              <div className="quote-empty">
                <p>Todavía no hay ofertas de insumos publicadas.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="detail-card sidebar">
          {isServiceProvider ? (
            <>
              <QuoteForm serviceId={service.id} />
              <div className="quotes-summary">
                <h3>Cotizaciones enviadas</h3>
                {service.quotes && service.quotes.length > 0 ? (
                  <ul className="quotes-list">
                    {service.quotes.map((quote) => (
                      <li key={quote.id} className="quote-item">
                        <div className="quote-header">
                          <span className="quote-provider">
                            {getProviderName(quote.serviceProviderId)}
                          </span>
                          <span className="quote-price">
                            USD {quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="quote-deadline">
                          <span className="meta-icon">⏳</span>
                          <span>Plazo estimado: {quote.deadline}</span>
                        </div>
                        {quote.notes && (
                          <p className="quote-notes">{quote.notes}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="quote-empty">
                    <p>Todavía no hay cotizaciones para este servicio.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="quote-disabled">
              <h3>Solo proveedores de servicio pueden cotizar</h3>
              <p>
                Inicia sesión con una cuenta de Proveedor de Servicio para enviar tu cotización.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ServiceDetailPage;

