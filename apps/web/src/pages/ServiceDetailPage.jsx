import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '@core-logic/context/GlobalStateContext';
import { useAuth } from '@core-logic/context/AuthContext';
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
  const [editingQuote, setEditingQuote] = useState(null);

  const service = useMemo(
    () => state.services.find((item) => item.id === id),
    [state.services, id]
  );

  const selectedQuote = useMemo(() => {
    if (!service?.selectedQuoteId) return null;
    return service.quotes?.find((quote) => quote.id === service.selectedQuoteId) ?? null;
  }, [service]);

  const selectedProvider = useMemo(() => {
    if (!selectedQuote) return null;
    return state.users.find((user) => user.id === selectedQuote.serviceProviderId) ?? null;
  }, [selectedQuote, state.users]);

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
    navigate('/dashboard');
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
  const selectedProviderName =
    selectedProvider?.name ||
    (selectedQuote ? getProviderName(selectedQuote.serviceProviderId) : null);
  const providerAverageRating =
    selectedProvider && typeof selectedProvider.averageRating === 'number'
      ? selectedProvider.averageRating
      : null;
  const providerRatingCount = selectedProvider?.ratingCount ?? 0;

  const getProviderProfile = (providerId) =>
    state.users.find((user) => user.id === providerId) ?? null;

  /**
   * Maneja la edición de una cotización
   */
  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
  };

  /**
   * Maneja la eliminación de una cotización
   */
  const handleDeleteQuote = (quoteId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
      dispatch({
        type: 'DELETE_QUOTE',
        payload: { serviceId: service.id, quoteId }
      });
    }
  };

  /**
   * Cancela la edición de cotización
   */
  const handleCancelEdit = () => {
    setEditingQuote(null);
  };

  /**
   * Guarda los cambios de una cotización editada
   */
  const handleSaveEdit = (updatedQuote) => {
    dispatch({
      type: 'UPDATE_QUOTE',
      payload: {
        serviceId: service.id,
        quoteId: editingQuote.id,
        quote: updatedQuote
      }
    });
    setEditingQuote(null);
  };

  return (
    <div className="service-detail-page">
      <div className="detail-header">
        <button onClick={handleBack} className="btn-back">
          ← Volver al dashboard
        </button>
        <div className="detail-brand">
          <span className="brand-name">MARKET DEL ESTE</span>
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
                  <strong>{selectedProviderName}</strong>. Marca como completado cuando el trabajo esté completo.
                </div>
              )}
              {isCompleted && selectedQuoteId && (
                <div className="selection-banner finalized">
                  Servicio completado con la propuesta de{' '}
                  <strong>{selectedProviderName}</strong>
                  {serviceRating != null
                    ? ` · Valoración otorgada: ${ratingLabel}`
                    : ' · Sin valoración registrada.'}{' '}
                  ¡Gracias por confiar en MARKET DEL ESTE!
                </div>
              )}

              {(isAssigned || isCompleted) && selectedProvider && (
                <div className="selected-provider-card">
                  <div>
                    <span className="card-label">Proveedor seleccionado</span>
                    <h3>{selectedProvider.name}</h3>
                  </div>
                  <div className="provider-rating-resume">
                    <span className="provider-rating-value">
                      ⭐{' '}
                      {providerAverageRating != null
                        ? providerAverageRating.toFixed(1)
                        : '0.0'}
                      /5
                    </span>
                    <span className="provider-rating-count">
                      {providerRatingCount > 0
                        ? `${providerRatingCount} valoración${providerRatingCount === 1 ? '' : 'es'}`
                        : 'Sin valoraciones registradas'}
                    </span>
                  </div>
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
                        <span className="quote-provider-rating">
                          {(() => {
                            const profile = getProviderProfile(quote.serviceProviderId);
                            if (profile?.ratingCount > 0) {
                              return `⭐ ${Number(profile.averageRating || 0).toFixed(1)} · ${
                                profile.ratingCount
                              } valoración${profile.ratingCount === 1 ? '' : 'es'}`;
                            }
                            return 'Sin valoraciones';
                          })()}
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
                  users={state.users}
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
              <QuoteForm 
                serviceId={service.id} 
                editingQuote={editingQuote}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
              <div className="quotes-summary">
                <h3>Cotizaciones enviadas</h3>
                {service.quotes && service.quotes.length > 0 ? (
                  <ul className="quotes-list">
                    {service.quotes.map((quote) => {
                      const isMyQuote = quote.serviceProviderId === user.id;
                      const canEditDelete = isMyQuote && 
                        (service.status === 'Publicado' || service.status === 'En Evaluación');
                      
                      return (
                        <li key={quote.id} className="quote-item">
                          <div className="quote-header">
                            <span className="quote-provider">
                              {getProviderName(quote.serviceProviderId)}
                              {isMyQuote && <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>(Tú)</span>}
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
                          {canEditDelete && (
                            <div style={{ 
                              marginTop: '12px', 
                              display: 'flex', 
                              gap: '8px',
                              paddingTop: '12px',
                              borderTop: '1px solid #eee'
                            }}>
                              <button
                                type="button"
                                onClick={() => handleEditQuote(quote)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#007bff',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '500'
                                }}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuote(quote.id)}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#dc3545',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '500'
                                }}
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                          )}
                        </li>
                      );
                    })}
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

