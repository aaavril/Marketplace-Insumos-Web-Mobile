import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../context/GlobalStateContext';
import { useAuth } from '../context/AuthContext';
import QuoteForm from '../components/QuoteForm';
import QuoteComparator from '../components/QuoteComparator';
import CompletionButton from '../components/CompletionButton';
import './ServiceDetailPage.css';

/**
 * ServiceDetailPage - Muestra el detalle de un servicio publicado
 * Permite a los Proveedores de Servicio enviar una cotización (F3.HU1)
 */
const ServiceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch } = useAppState();
  const { user } = useAuth();
  const [showComparator, setShowComparator] = useState(false);

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

  const getStatusClass = (status) =>
    status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

  const handleOpenComparator = () => {
    if (service.status === 'Publicado') {
      dispatch({
        type: 'MARK_SERVICE_IN_EVALUATION',
        payload: { serviceId: service.id },
      });
    }
    setShowComparator(true);
  };

  const handleCloseComparator = () => {
    setShowComparator(false);
  };

  const handleSelectQuote = (quoteId) => {
    if (!quoteId) return;
    dispatch({
      type: 'UPDATE_SERVICE_STATUS',
      payload: {
        serviceId: service.id,
        status: 'Asignado',
        selectedQuoteId: quoteId,
      },
    });
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
  const selectedQuoteId = service.selectedQuoteId;
  const isAssigned = service.status === 'Asignado';
  const isCompleted = service.status === 'Completado';
  const serviceRating = service.rating ?? null;
  const ratingLabels = {
    5: '⭐⭐⭐⭐⭐ Excelente',
    4: '⭐⭐⭐⭐ Muy bueno',
    3: '⭐⭐⭐ Bueno',
    2: '⭐⭐ Regular',
    1: '⭐ Deficiente',
  };
  const ratingLabel = serviceRating ? ratingLabels[serviceRating] || `${serviceRating}/5` : null;

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
            <span className={`service-status ${getStatusClass(service.status)}`}>
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

          {isCompleted && (
            <div className="service-rating-summary">
              <span className="rating-label">Valoración del proveedor:</span>
              <span className="rating-value">
                {ratingLabel || 'Sin valoración'}
              </span>
            </div>
          )}

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
              <div className="quotes-header">
                <h2>Cotizaciones recibidas</h2>
                <button
                  type="button"
                  className="btn-open-comparator"
                  onClick={handleOpenComparator}
                  disabled={!service.quotes || service.quotes.length === 0}
                >
                  {service.status === 'En Evaluación' || showComparator
                    ? 'Revisar comparador'
                    : 'Comparar cotizaciones'}
                </button>
              </div>
              {isAssigned && selectedQuoteId && !isCompleted && (
                <div className="selection-banner">
                  Has asignado este servicio a{' '}
                  <strong>
                    {getProviderName(
                      service.quotes.find((quote) => quote.id === selectedQuoteId)?.serviceProviderId
                    )}
                  </strong>. Marca como completado cuando el trabajo esté completo.
                </div>
              )}
              {isCompleted && selectedQuoteId && (
                <div className="selection-banner finalized">
                  Servicio completado con la propuesta de{' '}
                  <strong>
                    {getProviderName(
                      service.quotes.find((quote) => quote.id === selectedQuoteId)?.serviceProviderId
                    )}
                  </strong>
                  {serviceRating != null
                    ? ` · Valoración otorgada: ${ratingLabel}`
                    : ' · Sin valoración registrada.'}{' '}
                  ¡Gracias por confiar en Market del Este!
                </div>
              )}

              {service.quotes && service.quotes.length > 0 ? (
                <ul className="quotes-list">
                  {service.quotes.map((quote) => (
                    <li
                      key={quote.id}
                      className={`quote-item ${selectedQuoteId === quote.id ? 'selected' : ''}`}
                    >
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
                        <span>
                          {quote.duration
                            ? `Duración: ${quote.duration} día${quote.duration === 1 ? '' : 's'}`
                            : 'Duración no indicada'}
                        </span>
                      </div>
                      {quote.deadline && (
                        <div className="quote-deadline">
                          <span className="meta-icon">📅</span>
                          <span>Fecha estimada: {quote.deadline}</span>
                        </div>
                      )}
                      {quote.notes && (
                        <p className="quote-notes">{quote.notes}</p>
                      )}
                      {isSolicitante && (
                        selectedQuoteId === quote.id ? (
                          <span className={`quote-selected-badge ${isCompleted ? 'finalized' : ''}`}>
                            {isCompleted ? 'Servicio completado' : 'Cotización seleccionada'}
                          </span>
                        ) : !isCompleted ? (
                          <button
                            type="button"
                            className="btn-select-quote"
                            onClick={() => handleSelectQuote(quote.id)}
                          >
                            Seleccionar
                          </button>
                        ) : null
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="quote-empty">
                  <p>Todavía no hay cotizaciones para este servicio.</p>
                </div>
              )}

              {showComparator && (
                <QuoteComparator
                  quotes={service.quotes}
                  getProviderName={getProviderName}
                  onClose={handleCloseComparator}
                  selectedQuoteId={selectedQuoteId}
                  completedRatingLabel={ratingLabel}
                  serviceStatus={service.status}
                />
              )}

              {isSolicitante && isAssigned && selectedQuoteId && (
                <CompletionButton serviceId={service.id} />
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
                          <span>
                            {quote.duration
                              ? `Duración: ${quote.duration} día${quote.duration === 1 ? '' : 's'}`
                              : 'Duración no indicada'}
                          </span>
                        </div>
                        {quote.deadline && (
                          <div className="quote-deadline">
                            <span className="meta-icon">📅</span>
                            <span>Fecha estimada: {quote.deadline}</span>
                          </div>
                        )}
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

