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
 * SolicitanteDashboard - Dashboard para usuarios con rol Solicitante
 * Replica las funcionalidades del dashboard web adaptadas a mobile
 */
export default function SolicitanteDashboard({ navigation, onLogout }) {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePublicarServicio = () => {
    if (navigation) {
      navigation.navigate('ServiceForm');
    }
  };

  const myAllServices = state.services.filter(
    (service) => service.solicitanteId === currentUser?.id
  );

  const [serviceFilter, setServiceFilter] = useState('todos');

  // Calcular estadísticas
  const totalServices = myAllServices.length;
  const finalizedCount = myAllServices.filter((service) => {
    const status = service.status?.toLowerCase() || '';
    return status.includes('finalizado') || status.includes('completado');
  }).length;
  const inProgressCount = totalServices - finalizedCount;

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'solicitados', label: 'Solicitados' },
    { key: 'en-curso', label: 'En curso' },
    { key: 'finalizados', label: 'Finalizados' },
  ];

  // Filtrar servicios según el filtro seleccionado
  const filteredServices = myAllServices.filter((service) => {
    const normalizedStatus = (service.status?.toLowerCase() || '').trim();

    switch (serviceFilter) {
      case 'solicitados':
        return normalizedStatus === 'publicado';
      case 'en-curso':
        return (
          normalizedStatus === 'en evaluación' || normalizedStatus === 'asignado'
        );
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

  // Ordenar servicios (finalizados al final cuando se muestran todos)
  const orderedServices = useMemo(() => {
    if (serviceFilter !== 'todos') {
      return filteredServices;
    }

    const getWeight = (service) => {
      const status = (service.status?.toLowerCase() || '').trim();
      return status.includes('finalizado') || status.includes('completado') ? 1 : 0;
    };

    return [...filteredServices].sort((a, b) => {
      const diff = getWeight(a) - getWeight(b);
      if (diff !== 0) return diff;
      return 0;
    });
  }, [filteredServices, serviceFilter]);

  const handleServiceDetail = (serviceId) => {
    if (navigation) {
      navigation.navigate('ServiceDetail', { serviceId });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con menú */}
      <View style={styles.topHeader}>
        <MenuButton onPress={() => setMenuVisible(true)} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MARKET DEL ESTE</Text>
          <Text style={styles.headerSubtitle}>Solicitante</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardHeaderTitle}>
            Gestiona tus solicitudes de servicio
          </Text>
        </View>

        {/* Botón de acción */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePublicarServicio}
          >
            <Text style={styles.actionButtonText}>Publicar servicio</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de resumen */}
        <View style={styles.summaryCards}>
          <SummaryCard label="Total solicitados" value={totalServices} />
          <SummaryCard label="En curso" value={inProgressCount} />
          <SummaryCard label="Finalizados" value={finalizedCount} />
        </View>

        {/* Filtros */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Servicios</Text>
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
              const assignedProvider = getAssignedProviderName(service, state.users);

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  assignedProvider={assignedProvider}
                  onPress={() => handleServiceDetail(service.id)}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No hay servicios para el filtro seleccionado.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handlePublicarServicio}
              >
                <Text style={styles.emptyStateButtonText}>
                  Publicar nuevo servicio
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
  summaryCards: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    marginBottom: 16,
  },
  emptyStateButton: {
    paddingVertical: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

