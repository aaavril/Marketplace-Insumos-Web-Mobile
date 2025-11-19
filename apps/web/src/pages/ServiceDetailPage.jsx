/**
 * ServiceDetailPage.jsx - PÁGINA DE DETALLE DE SERVICIO
 * 
 * Esta página muestra toda la información detallada de un servicio específico.
 * Según el rol del usuario, muestra diferentes funcionalidades:
 * 
 * Para SOLICITANTES (dueño del servicio):
 * - Ver todas las cotizaciones recibidas
 * - Comparar cotizaciones en una tabla
 * - Seleccionar una cotización (cambia estado a "Asignado")
 * - Marcar servicio como completado con valoración
 * 
 * Para PROVEEDORES DE SERVICIO:
 * - Ver detalles del servicio
 * - Enviar una cotización (precio, duración, deadline, notas)
 * - Editar/eliminar sus propias cotizaciones (si el servicio aún está en "Publicado" o "En Evaluación")
 * - Ver todas las cotizaciones enviadas
 * 
 * Para otros usuarios:
 * - Solo ver detalles del servicio (no pueden cotizar)
 * 
 * Ruta: /services/:id (definida en AppRouter.jsx)
 * - :id es un parámetro dinámico que identifica el servicio
 * Protección: ProtectedRoute (solo visible si estás autenticado)
 * 
 * Estado del servicio:
 * - Publicado: Servicio creado, esperando cotizaciones
 * - En Evaluación: Solicitante abrió el comparador de cotizaciones
 * - Asignado: Solicitante seleccionó una cotización
 * - Completado: Servicio finalizado con opcional valoración del proveedor
 */

// useMemo: Hook para memoizar valores computados y evitar recálculos innecesarios
// useState: Hook para manejar estado local del componente
import { useMemo, useState } from 'react';

// useNavigate: Hook para navegar programáticamente
// useParams: Hook para obtener parámetros de la URL (ej: :id)
import { useNavigate, useParams } from 'react-router-dom';

// useAppState: Hook para acceder al estado global de la aplicación
import { useAppState } from '@core-logic/context/GlobalStateContext';

// useAuth: Hook para acceder a información de autenticación
import { useAuth } from '@core-logic/context/AuthContext';

// QuoteForm: Componente para enviar/editar cotizaciones (solo para Proveedores de Servicio)
import QuoteForm from '../components/QuoteForm';

// QuoteComparator: Componente para comparar cotizaciones en tabla (solo para Solicitantes)
import QuoteComparator from '../components/QuoteComparator';

// CompletionButton: Componente para marcar servicio como completado (solo para Solicitantes)
import CompletionButton from '../components/CompletionButton';

// Estilos específicos de la página ServiceDetail
import './ServiceDetailPage.css';

/**
 * ServiceDetailPage - Muestra el detalle de un servicio publicado
 * Permite a los Proveedores de Servicio enviar una cotización (F3.HU1)
 * Permite a los Solicitantes comparar y seleccionar cotizaciones
 * 
 * @returns {JSX.Element} Página completa con detalle del servicio y funcionalidades según rol
 */
const ServiceDetailPage = () => {
  // Hook para navegar programáticamente
  const navigate = useNavigate();
  
  // Obtiene el parámetro :id de la URL (ej: /services/123 → id = "123")
  const { id } = useParams();
  
  // Obtiene el estado global y la función dispatch para modificar el estado
  const { state, dispatch } = useAppState();
  
  // Obtiene el usuario autenticado actual
  const { user } = useAuth();
  
  // Estado local: controla si se muestra el comparador de cotizaciones
  const [showComparator, setShowComparator] = useState(false);
  
  // Estado local: cotización que se está editando (null si no hay ninguna)
  const [editingQuote, setEditingQuote] = useState(null);

  /**
   * Busca el servicio en el estado global usando el ID de la URL
   * useMemo evita buscar el servicio en cada render, solo se recalcula si cambia
   * state.services o id
   */
  const service = useMemo(
    () => state.services.find((item) => item.id === id),
    [state.services, id]
  );

  /**
   * Cotización seleccionada por el solicitante (si existe)
   * Se busca usando el selectedQuoteId del servicio
   */
  const selectedQuote = useMemo(() => {
    if (!service?.selectedQuoteId) return null;
    return service.quotes?.find((quote) => quote.id === service.selectedQuoteId) ?? null;
  }, [service]);

  /**
   * Proveedor que envió la cotización seleccionada
   * Se busca en el array de usuarios usando el serviceProviderId de la cotización
   */
  const selectedProvider = useMemo(() => {
    if (!selectedQuote) return null;
    return state.users.find((user) => user.id === selectedQuote.serviceProviderId) ?? null;
  }, [selectedQuote, state.users]);

  // Lista de ofertas de insumos disponibles (para mostrar en la página)
  const supplyOffers = state.supplyOffers || [];

  /**
   * Nombre del solicitante (dueño del servicio)
   * Se busca en el array de usuarios usando el solicitanteId del servicio
   */
  const solicitanteName = useMemo(() => {
    if (!service) return '';
    const solicitante = state.users.find((u) => u.id === service.solicitanteId);
    return solicitante ? solicitante.name : 'Solicitante';
  }, [service, state.users]);

  /**
   * Función helper para obtener el nombre de un proveedor por su ID
   * @param {string} providerId - ID del proveedor
   * @returns {string} Nombre del proveedor o 'Proveedor' si no se encuentra
   */
  const getProviderName = (providerId) => {
    const provider = state.users.find((u) => u.id === providerId);
    return provider ? provider.name : 'Proveedor';
  };

  /**
   * Función helper para convertir el estado del servicio a una clase CSS
   * Ejemplo: "En Evaluación" → "en-evaluacion"
   * @param {string} status - Estado del servicio
   * @returns {string} Clase CSS normalizada
   */
  const getStatusClass = (status) =>
    status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

  /**
   * Maneja la apertura del comparador de cotizaciones
   * Si el servicio está en "Publicado", cambia su estado a "En Evaluación"
   * Esto permite rastrear cuando un solicitante está evaluando cotizaciones
   */
  const handleOpenComparator = () => {
    if (service.status === 'Publicado') {
      dispatch({
        type: 'MARK_SERVICE_IN_EVALUATION',
        payload: { serviceId: service.id },
      });
    }
    setShowComparator(true);
  };

  /**
   * Maneja el cierre del comparador de cotizaciones
   */
  const handleCloseComparator = () => {
    setShowComparator(false);
  };

  /**
   * Maneja la selección de una cotización por parte del solicitante
   * Cambia el estado del servicio a "Asignado" y guarda la cotización seleccionada
   * @param {string} quoteId - ID de la cotización seleccionada
   */
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

  /**
   * Maneja el click en el botón "Volver al Dashboard"
   * Redirige al usuario de vuelta a su dashboard principal
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  /**
   * Si el servicio no existe (no se encontró en el estado global),
   * muestra una página de error 404
   */
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

  // Variables booleanas para determinar qué funcionalidades mostrar según el rol y estado
  
  // Es true si el usuario actual es un Proveedor de Servicio
  const isServiceProvider = user?.role === 'Proveedor de Servicio';
  
  // Es true si el usuario actual es el dueño del servicio (Solicitante)
  const isSolicitante = user?.id && service?.solicitanteId === user.id;
  
  // ID de la cotización seleccionada (null si ninguna está seleccionada)
  const selectedQuoteId = service.selectedQuoteId;
  
  // Es true si el servicio está asignado a un proveedor
  const isAssigned = service.status === 'Asignado';
  
  // Es true si el servicio está completado
  const isCompleted = service.status === 'Completado';
  
  // Rating del servicio (1-5) si está completado y fue valorado
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
   * Solo disponible para el proveedor que la envió, y solo si el servicio
   * está en "Publicado" o "En Evaluación"
   * @param {Object} quote - Cotización a editar
   */
  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
  };

  /**
   * Maneja la eliminación de una cotización
   * Muestra un confirm antes de eliminar para evitar eliminaciones accidentales
   * @param {string} quoteId - ID de la cotización a eliminar
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
   * Limpia el estado editingQuote para volver a mostrar el formulario normal
   */
  const handleCancelEdit = () => {
    setEditingQuote(null);
  };

  /**
   * Guarda los cambios de una cotización editada
   * Actualiza la cotización en el estado global
   * @param {Object} updatedQuote - Cotización con los datos actualizados
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

