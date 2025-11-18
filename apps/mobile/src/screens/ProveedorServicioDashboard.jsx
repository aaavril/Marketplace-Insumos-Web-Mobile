import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import SummaryCard from '../components/SummaryCard';
import FilterPills from '../components/FilterPills';
import ServiceCard from '../components/ServiceCard';
import MenuButton from '../components/MenuButton';
import MenuDrawer from '../components/MenuDrawer';
import { getAssignedProviderName } from '../utils/helpers';

/**
 * ProveedorServicioDashboard - Dashboard para usuarios con rol Proveedor de Servicio
 * Replica las funcionalidades del dashboard web adaptadas a mobile
 * Muestra servicios donde el proveedor ha cotizado y permite gestionarlos
 */
export default function ProveedorServicioDashboard({ navigation, onLogout }) {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  const [menuVisible, setMenuVisible] = useState(false);

  // Servicios donde el proveedor ha cotizado
  const providerServices = useMemo(
    () =>
      state.services.filter((service) =>
        service.quotes?.some((quote) => quote.serviceProviderId === currentUser?.id)
      ),
    [state.services, currentUser?.id]
  );

  const [serviceFilter, setServiceFilter] = useState('todos');

  // Calcular estadísticas
  const totalGestionados = providerServices.length;
  const cotizadosCount = providerServices.length; // Todos los que aparecen aquí son cotizados
  const asignadosCount = providerServices.filter((service) => service.status === 'Asignado').length;
  const finalizadosCount = providerServices.filter((service) => {
    const normalized = service.status?.toLowerCase() || '';
    return normalized.includes('finalizado') || normalized.includes('completado');
  }).length;

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'cotizados', label: 'Cotizados' },
    { key: 'asignados', label: 'Asignados' },
    { key: 'finalizados', label: 'Finalizados' },
  ];

  // Obtener la cotización del proveedor para un servicio
  const getMyQuoteForService = (service) =>
    service.quotes?.find((quote) => quote.serviceProviderId === currentUser?.id);

  // Filtrar servicios según el filtro seleccionado
  const filteredServices = providerServices.filter((service) => {
    const normalizedStatus = (service.status?.toLowerCase() || '').trim();

    switch (serviceFilter) {
      case 'cotizados':
        return true; // Todos aquí son cotizados
      case 'asignados':
        return normalizedStatus === 'asignado';
      case 'finalizados':
        return (
          normalizedStatus.includes('finalizado') ||
          normalizedStatus.includes('completado')
        );
      case 'todos':
      default:
        return true;
    }
  });

  // Ordenar servicios (finalizados al final, asignados en medio)
  const orderedServices = useMemo(() => {
    if (serviceFilter !== 'todos') {
      return filteredServices;
    }

    const getWeight = (service) => {
      const normalized = (service.status?.toLowerCase() || '').trim();
      if (normalized.includes('finalizado') || normalized.includes('completado')) return 2;
      if (normalized === 'asignado') return 1;
      return 0;
    };

    return [...filteredServices].sort((a, b) => getWeight(a) - getWeight(b));
  }, [filteredServices, serviceFilter]);

  const handleVerServiciosDisponibles = () => {
    if (navigation) {
      navigation.navigate('ServiceList');
    }
  };

  const handleServiceDetail = (service) => {
    if (navigation) {
      navigation.navigate('ServiceDetail', { serviceId: service.id });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con menú */}
      <View style={styles.topHeader}>
        <MenuButton onPress={() => setMenuVisible(true)} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MARKET DEL ESTE</Text>
          <Text style={styles.headerSubtitle}>Proveedor de Servicio</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardHeaderTitle}>
            Gestiona tus servicios como proveedor
          </Text>
          <Text style={styles.dashboardSubtitle}>
            Monitorea tus cotizaciones y el estado de cada servicio en curso
          </Text>
        </View>

        {/* Botón de acción */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleVerServiciosDisponibles}
          >
            <Text style={styles.actionButtonText}>Ver servicios disponibles</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de resumen */}
        <View style={styles.summaryCardsContainer}>
          <View style={styles.summaryCards}>
            <SummaryCard label="Total gestionados" value={totalGestionados} />
            <SummaryCard label="Cotizados" value={cotizadosCount} />
          </View>
          <View style={styles.summaryCards}>
            <SummaryCard label="Asignados" value={asignadosCount} />
            <SummaryCard label="Finalizados" value={finalizadosCount} />
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Servicios gestionados</Text>
          <FilterPills
            filters={filters}
            activeFilter={serviceFilter}
            onFilterChange={setServiceFilter}
          />
        </View>

        {/* Lista de servicios */}
        <View style={styles.servicesSection}>
          {orderedServices.length > 0 ? (
            orderedServices.map((service) => {
              const myQuote = getMyQuoteForService(service);
              const assignedProvider = getAssignedProviderName(service, state.users);

              return (
                <View key={service.id} style={styles.serviceCardWrapper}>
                  <ServiceCard
                    service={service}
                    assignedProvider={assignedProvider}
                    onPress={() => handleServiceDetail(service)}
                  />
                  {/* Información adicional del proveedor */}
                  {myQuote && (
                    <View style={styles.quoteInfo}>
                      <View style={styles.quoteBadge}>
                        <Text style={styles.quoteBadgeText}>
                          💰 Mi oferta: USD {myQuote.price.toLocaleString('es-UY', {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                      {myQuote.deadline && (
                        <Text style={styles.quoteDeadline}>
                          ⏳ Plazo: {myQuote.deadline}
                        </Text>
                      )}
                      {myQuote.duration && (
                        <Text style={styles.quoteDuration}>
                          📅 Duración: {myQuote.duration} día{myQuote.duration !== 1 ? 's' : ''}
                        </Text>
                      )}
                      {service.status === 'Publicado' && (
                        <TouchableOpacity
                          style={styles.editQuoteButton}
                          onPress={() => handleServiceDetail(service)}
                        >
                          <Text style={styles.editQuoteButtonText}>
                            Editar cotización
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                  {!myQuote && service.status === 'Publicado' && (
                    <TouchableOpacity
                      style={styles.quoteButton}
                      onPress={() => handleServiceDetail(service)}
                    >
                      <Text style={styles.quoteButtonText}>Enviar cotización</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No has cotizado ningún servicio aún.
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Busca servicios disponibles para empezar a cotizar.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleVerServiciosDisponibles}
              >
                <Text style={styles.emptyStateButtonText}>
                  Ver servicios disponibles
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Menu Drawer */}
      <MenuDrawer
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onLogout={onLogout}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topHeader: {
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
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dashboardHeader: {
    backgroundColor: '#fff',
    padding: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dashboardHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    lineHeight: 28,
    marginBottom: 8,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  headerActions: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  summaryCardsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  filterSection: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  servicesSection: {
    padding: 20,
    gap: 16,
  },
  serviceCardWrapper: {
    marginBottom: 16,
  },
  quoteInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: -8,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: '#eee',
    borderTopColor: 'transparent',
  },
  quoteBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  quoteBadgeText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
  quoteDeadline: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  quoteDuration: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  editQuoteButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  editQuoteButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  quoteButton: {
    backgroundColor: '#28a745',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  quoteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

