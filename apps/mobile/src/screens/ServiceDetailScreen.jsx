import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import { getRatingLabel, getProviderName } from '../utils/helpers';
import QuoteComparator from '../components/QuoteComparator';
import CompletionButton from '../components/CompletionButton';

/**
 * ServiceDetailScreen - Pantalla de detalle completo de un servicio
 * Replica las funcionalidades de ServiceDetailPage de la web
 * Permite a Solicitantes ver cotizaciones y seleccionar proveedores
 * Permite a Proveedores enviar cotizaciones
 */
export default function ServiceDetailScreen({ navigation, route }) {
  const { state, dispatch } = useAppState();
  const { serviceId } = route?.params || {};
  const currentUser = state.currentUser;

  const [showComparator, setShowComparator] = useState(false);

  // Obtener el servicio
  const service = useMemo(
    () => state.services.find((item) => item.id === serviceId),
    [state.services, serviceId]
  );

  const selectedQuote = useMemo(() => {
    if (!service?.selectedQuoteId) return null;
    return service.quotes?.find((quote) => quote.id === service.selectedQuoteId) ?? null;
  }, [service]);

  const selectedProvider = useMemo(() => {
    if (!selectedQuote) return null;
    return state.users.find((user) => user.id === selectedQuote.serviceProviderId) ?? null;
  }, [selectedQuote, state.users]);

  const solicitanteName = useMemo(() => {
    if (!service) return '';
    const solicitante = state.users.find((u) => u.id === service.solicitanteId);
    return solicitante ? solicitante.name : 'Solicitante';
  }, [service, state.users]);

  const getProviderProfile = (providerId) =>
    state.users.find((user) => user.id === providerId) ?? null;

  const isServiceProvider = currentUser?.role === 'Proveedor de Servicio';
  const isSolicitante = currentUser?.id && service?.solicitanteId === currentUser?.id;
  const selectedQuoteId = service?.selectedQuoteId;
  const isAssigned = service?.status === 'Asignado';
  const isCompleted = service?.status === 'Completado';
  const serviceRating = service?.rating ?? null;
  const ratingLabel = serviceRating ? getRatingLabel(serviceRating) : null;

  const selectedProviderName =
    selectedProvider?.name ||
    (selectedQuote ? getProviderName(state.users, selectedQuote.serviceProviderId) : null);
  const providerAverageRating =
    selectedProvider && typeof selectedProvider.averageRating === 'number'
      ? selectedProvider.averageRating
      : null;
  const providerRatingCount = selectedProvider?.ratingCount ?? 0;

  const supplyOffers = state.supplyOffers || [];

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
    Alert.alert('Éxito', 'Cotización seleccionada. El servicio ha sido asignado al proveedor.');
  };

  const [editingQuote, setEditingQuote] = useState(null);

  const handleCotizar = () => {
    // Verificar que el servicio aún esté disponible para cotizar
    if (service.status === 'Asignado' || service.status === 'Completado') {
      Alert.alert('Error', 'Este servicio ya ha sido asignado. No se pueden agregar nuevas cotizaciones.');
      return;
    }
    
    if (navigation && service) {
      if (editingQuote) {
        // Si hay una cotización en edición, navegar al formulario con esa cotización
        navigation.navigate('QuoteForm', { 
          serviceId: service.id, 
          service,
          editingQuote 
        });
      } else {
        navigation.navigate('QuoteForm', { serviceId: service.id, service });
      }
    }
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    if (navigation && service) {
      navigation.navigate('QuoteForm', { 
        serviceId: service.id, 
        service,
        editingQuote: quote 
      });
    }
  };

  const handleDeleteQuote = (quoteId) => {
    Alert.alert(
      'Eliminar Cotización',
      '¿Estás seguro de que quieres eliminar esta cotización?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            dispatch({
              type: 'DELETE_QUOTE',
              payload: { serviceId: service.id, quoteId }
            });
            Alert.alert('Éxito', 'Cotización eliminada correctamente');
          }
        }
      ]
    );
  };

  const handleCancelEdit = () => {
    setEditingQuote(null);
  };

  const handleCompleted = () => {
    // CompletionButton maneja la lógica, solo necesitamos refrescar
    // El estado se actualiza automáticamente por el reducer
  };

  if (!service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Servicio no encontrado</Text>
          <Text style={styles.notFoundText}>
            El servicio que buscas no está disponible o ha sido eliminado.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Obtener cotización del proveedor actual si es Proveedor de Servicio
  const myQuote = isServiceProvider
    ? service.quotes?.find((quote) => quote.serviceProviderId === currentUser?.id)
    : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con botón volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MARKET DEL ESTE</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Información principal del servicio */}
        <View style={styles.serviceInfoCard}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <View style={[styles.statusBadge, styles[`status${service.status?.replace(/\s+/g, '')}`]]}>
              <Text style={styles.statusText}>{service.status}</Text>
            </View>
          </View>

          <Text style={styles.serviceDescription}>{service.description}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <View style={styles.metaContent}>
                <Text style={styles.metaLabel}>Ubicación</Text>
                <Text style={styles.metaValue}>{service.location}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📅</Text>
              <View style={styles.metaContent}>
                <Text style={styles.metaLabel}>Fecha deseada</Text>
                <Text style={styles.metaValue}>{service.date}</Text>
              </View>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>👤</Text>
              <View style={styles.metaContent}>
                <Text style={styles.metaLabel}>Solicitante</Text>
                <Text style={styles.metaValue}>{solicitanteName}</Text>
              </View>
            </View>
          </View>

          {isCompleted && ratingLabel && (
            <View style={styles.ratingSummary}>
              <Text style={styles.ratingLabel}>Valoración del proveedor:</Text>
              <Text style={styles.ratingValue}>{ratingLabel}</Text>
            </View>
          )}

          {/* Insumos requeridos */}
          {service.requiredSupplies?.length > 0 && (
            <View style={styles.suppliesSection}>
              <Text style={styles.sectionTitle}>Insumos requeridos</Text>
              <View style={styles.suppliesGrid}>
                {service.requiredSupplies.map((supply, index) => (
                  <View key={index} style={styles.supplyItem}>
                    <Text style={styles.supplyName}>{supply.name}</Text>
                    {(supply.quantity || supply.unit) && (
                      <Text style={styles.supplyMeta}>
                        {supply.quantity || ''}
                        {supply.quantity && supply.unit ? ' ' : ''}
                        {supply.unit || ''}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Vista para Solicitante */}
        {isSolicitante && (
          <View style={styles.quotesSection}>
            <View style={styles.quotesHeader}>
              <Text style={styles.sectionTitle}>Cotizaciones recibidas</Text>
              <TouchableOpacity
                style={[
                  styles.comparatorButton,
                  (!service.quotes || service.quotes.length === 0) && styles.disabledButton,
                ]}
                onPress={handleOpenComparator}
                disabled={!service.quotes || service.quotes.length === 0}
              >
                <Text
                  style={[
                    styles.comparatorButtonText,
                    (!service.quotes || service.quotes.length === 0) && styles.disabledButtonText,
                  ]}
                >
                  {service.status === 'En Evaluación' || showComparator
                    ? 'Revisar comparador'
                    : 'Comparar cotizaciones'}
                </Text>
              </TouchableOpacity>
            </View>

            {isAssigned && selectedQuoteId && !isCompleted && (
              <View style={styles.selectionBanner}>
                <Text style={styles.selectionBannerText}>
                  Has asignado este servicio a <Text style={styles.boldText}>{selectedProviderName}</Text>.
                  Marca como completado cuando el trabajo esté completo.
                </Text>
              </View>
            )}

            {isCompleted && selectedQuoteId && (
              <View style={[styles.selectionBanner, styles.finalizedBanner]}>
                <Text style={styles.selectionBannerText}>
                  Servicio completado con la propuesta de <Text style={styles.boldText}>{selectedProviderName}</Text>
                  {serviceRating != null
                    ? ` · Valoración otorgada: ${ratingLabel}`
                    : ' · Sin valoración registrada.'}{' '}
                  ¡Gracias por confiar en MARKET DEL ESTE!
                </Text>
              </View>
            )}

            {/* Proveedor seleccionado */}
            {(isAssigned || isCompleted) && selectedProvider && (
              <View style={styles.selectedProviderCard}>
                <View style={styles.providerInfo}>
                  <Text style={styles.providerLabel}>Proveedor seleccionado</Text>
                  <Text style={styles.providerName}>{selectedProvider.name}</Text>
                </View>
                <View style={styles.providerRating}>
                  <Text style={styles.providerRatingValue}>
                    ⭐ {providerAverageRating != null ? providerAverageRating.toFixed(1) : '0.0'}/5
                  </Text>
                  <Text style={styles.providerRatingCount}>
                    {providerRatingCount > 0
                      ? `${providerRatingCount} valoración${providerRatingCount === 1 ? '' : 'es'}`
                      : 'Sin valoraciones registradas'}
                  </Text>
                </View>
              </View>
            )}

            {/* Lista de cotizaciones */}
            {service.quotes && service.quotes.length > 0 ? (
              <View style={styles.quotesList}>
                {service.quotes.map((quote) => {
                  const profile = getProviderProfile(quote.serviceProviderId);
                  const providerHasRatings = profile && (profile.ratingCount ?? 0) > 0;
                  const providerRatingText = providerHasRatings
                    ? `⭐ ${Number(profile.averageRating || 0).toFixed(1)} · ${profile.ratingCount} valoración${profile.ratingCount === 1 ? '' : 'es'}`
                    : 'Sin valoraciones';

                  return (
                    <View
                      key={quote.id}
                      style={[
                        styles.quoteCard,
                        selectedQuoteId === quote.id && styles.quoteCardSelected,
                      ]}
                    >
                      <View style={styles.quoteHeader}>
                        <View style={styles.quoteProviderInfo}>
                          <Text style={styles.quoteProviderName}>
                            {getProviderName(state.users, quote.serviceProviderId)}
                          </Text>
                          <Text style={styles.quoteProviderRating}>{providerRatingText}</Text>
                        </View>
                        <Text style={styles.quotePrice}>
                          USD {quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                        </Text>
                      </View>

                      <View style={styles.quoteMeta}>
                        <Text style={styles.quoteMetaText}>
                          ⏳ {quote.duration
                            ? `Duración: ${quote.duration} día${quote.duration === 1 ? '' : 's'}`
                            : 'Duración no indicada'}
                        </Text>
                        {quote.deadline && (
                          <Text style={styles.quoteMetaText}>
                            📅 Fecha estimada: {quote.deadline}
                          </Text>
                        )}
                      </View>

                      {quote.notes && (
                        <Text style={styles.quoteNotes}>{quote.notes}</Text>
                      )}

                      {selectedQuoteId === quote.id ? (
                        <View
                          style={[
                            styles.quoteSelectedBadge,
                            isCompleted && styles.quoteSelectedBadgeFinalized,
                          ]}
                        >
                          <Text style={styles.quoteSelectedBadgeText}>
                            {isCompleted ? 'Servicio completado' : 'Cotización seleccionada'}
                          </Text>
                        </View>
                      ) : (
                        !isCompleted && (
                          <TouchableOpacity
                            style={styles.selectQuoteButton}
                            onPress={() => handleSelectQuote(quote.id)}
                          >
                            <Text style={styles.selectQuoteButtonText}>Seleccionar</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Todavía no hay cotizaciones para este servicio.
                </Text>
              </View>
            )}

            {/* Botón para marcar como completado */}
            {isSolicitante && isAssigned && selectedQuoteId && !isCompleted && (
              <CompletionButton serviceId={service.id} onCompleted={handleCompleted} />
            )}
          </View>
        )}

        {/* Vista para Proveedor de Servicio */}
        {isServiceProvider && (
          <View style={styles.providerSection}>
            {/* Botón de cotizar/editar - bloqueado si está asignado */}
            {(service.status === 'Publicado' || service.status === 'En Evaluación') ? (
              <TouchableOpacity 
                style={styles.cotizarButton} 
                onPress={handleCotizar}
                disabled={service.status === 'Asignado' || service.status === 'Completado'}
              >
                <Text style={styles.cotizarButtonText}>
                  {myQuote ? 'Editar mi cotización' : 'Enviar cotización'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.blockedQuoteButton}>
                <Text style={styles.blockedQuoteText}>
                  ⚠️ Este servicio ya ha sido asignado. No se pueden agregar nuevas cotizaciones.
                </Text>
              </View>
            )}

            {service.quotes && service.quotes.length > 0 && (
              <View style={styles.quotesSummary}>
                <Text style={styles.sectionTitle}>Cotizaciones enviadas</Text>
                <View style={styles.quotesList}>
                  {service.quotes.map((quote) => {
                    const isMyQuote = quote.serviceProviderId === currentUser?.id;
                    const canEditDelete = isMyQuote && 
                      (service.status === 'Publicado' || service.status === 'En Evaluación');
                    
                    return (
                      <View key={quote.id} style={styles.quoteCard}>
                        <View style={styles.quoteHeader}>
                          <View style={styles.quoteProviderInfo}>
                            <Text style={styles.quoteProviderName}>
                              {getProviderName(state.users, quote.serviceProviderId)}
                            </Text>
                            {isMyQuote && (
                              <Text style={styles.myQuoteLabel}>(Tú)</Text>
                            )}
                          </View>
                          <Text style={styles.quotePrice}>
                            USD {quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                          </Text>
                        </View>
                        <View style={styles.quoteMeta}>
                          <Text style={styles.quoteMetaText}>
                            ⏳ {quote.duration
                              ? `Duración: ${quote.duration} día${quote.duration === 1 ? '' : 's'}`
                              : 'Duración no indicada'}
                          </Text>
                          {quote.deadline && (
                            <Text style={styles.quoteMetaText}>
                              📅 Fecha estimada: {quote.deadline}
                            </Text>
                          )}
                        </View>
                        {quote.notes && (
                          <Text style={styles.quoteNotes}>{quote.notes}</Text>
                        )}
                        {canEditDelete && (
                          <View style={styles.quoteActions}>
                            <TouchableOpacity
                              style={styles.editQuoteButton}
                              onPress={() => handleEditQuote(quote)}
                            >
                              <Text style={styles.editQuoteButtonText}>✏️ Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.deleteQuoteButton}
                              onPress={() => handleDeleteQuote(quote.id)}
                            >
                              <Text style={styles.deleteQuoteButtonText}>🗑️ Eliminar</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Ofertas de insumos disponibles */}
        {supplyOffers.length > 0 && (
          <View style={styles.supplyOffersSection}>
            <Text style={styles.sectionTitle}>Packs de insumos disponibles</Text>
            <View style={styles.offersList}>
              {supplyOffers.map((offer) => (
                <View key={offer.id} style={styles.offerCard}>
                  <View style={styles.offerHeader}>
                    <View style={styles.offerHeaderLeft}>
                      <Text style={styles.offerTitle}>{offer.title}</Text>
                      <Text style={styles.offerProvider}>
                        Ofrecido por {offer.providerName || getProviderName(state.users, offer.providerId)}
                      </Text>
                    </View>
                    <Text style={styles.offerPrice}>
                      USD {offer.totalPrice.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>

                  {offer.description && (
                    <Text style={styles.offerDescription}>{offer.description}</Text>
                  )}

                  <View style={styles.offerItems}>
                    <Text style={styles.offerItemsTitle}>Insumos incluidos:</Text>
                    {offer.items && offer.items.length > 0 ? (
                      <View style={styles.offerItemsList}>
                        {offer.items.map((item, index) => (
                          <Text key={index} style={styles.offerItem}>
                            <Text style={styles.offerItemName}>{item.name}</Text>
                            {(item.quantity || item.unit) && (
                              <Text style={styles.offerItemMeta}>
                                {' '}- {item.quantity || ''}
                                {item.unit ? ` ${item.unit}` : ''}
                              </Text>
                            )}
                          </Text>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noItemsText}>Sin insumos especificados</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal del Comparador de Cotizaciones */}
      {showComparator && (
        <QuoteComparator
          quotes={service.quotes || []}
          getProviderName={(id) => getProviderName(state.users, id)}
          users={state.users}
          onClose={handleCloseComparator}
          selectedQuoteId={selectedQuoteId}
          completedRatingLabel={ratingLabel}
          serviceStatus={service.status}
          onSelectQuote={handleSelectQuote}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: 0.5,
  },
  headerPlaceholder: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  serviceInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginRight: 12,
    lineHeight: 32,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPublicado: {
    backgroundColor: '#e8f5e9',
  },
  statusEnEvaluación: {
    backgroundColor: '#fff3e0',
  },
  statusAsignado: {
    backgroundColor: '#e3f2fd',
  },
  statusCompletado: {
    backgroundColor: '#e0f2f1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
  },
  serviceDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  metaContent: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  ratingSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  suppliesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  suppliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supplyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  supplyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  supplyMeta: {
    fontSize: 12,
    color: '#666',
  },
  quotesSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  quotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  comparatorButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  comparatorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#999',
  },
  selectionBanner: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  finalizedBanner: {
    backgroundColor: '#e8f5e9',
    borderLeftColor: '#4caf50',
  },
  selectionBannerText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
  },
  selectedProviderCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  providerInfo: {
    marginBottom: 12,
  },
  providerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerRatingValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  providerRatingCount: {
    fontSize: 14,
    color: '#666',
  },
  quotesList: {
    gap: 16,
  },
  quoteCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  quoteCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quoteProviderInfo: {
    flex: 1,
    marginRight: 12,
  },
  quoteProviderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  quoteProviderRating: {
    fontSize: 12,
    color: '#666',
  },
  quotePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  quoteMeta: {
    gap: 8,
    marginBottom: 12,
  },
  quoteMetaText: {
    fontSize: 14,
    color: '#666',
  },
  quoteNotes: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  quoteSelectedBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  quoteSelectedBadgeFinalized: {
    backgroundColor: '#4caf50',
  },
  quoteSelectedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectQuoteButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  selectQuoteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  providerSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cotizarButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  cotizarButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  blockedQuoteButton: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  blockedQuoteText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
  quoteProviderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  myQuoteLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  quoteActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editQuoteButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  editQuoteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteQuoteButton: {
    flex: 1,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  deleteQuoteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quotesSummary: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  supplyOffersSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  offersList: {
    gap: 16,
  },
  offerCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  offerHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  offerProvider: {
    fontSize: 12,
    color: '#666',
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  offerItems: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  offerItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  offerItemsList: {
    gap: 6,
  },
  offerItem: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    paddingLeft: 8,
  },
  offerItemName: {
    fontWeight: '600',
    color: '#333',
  },
  offerItemMeta: {
    color: '#888',
  },
  noItemsText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    paddingLeft: 8,
  },
});

