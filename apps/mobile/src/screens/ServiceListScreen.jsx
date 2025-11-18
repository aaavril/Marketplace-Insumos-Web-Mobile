import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import PublicServiceCard from '../components/PublicServiceCard';
import MenuButton from '../components/MenuButton';
import MenuDrawer from '../components/MenuDrawer';

/**
 * ServiceListScreen - Listado de servicios publicados para proveedores
 * Muestra servicios con status 'Publicado' para que los proveedores puedan cotizar
 */
export default function ServiceListScreen({ navigation, onLogout }) {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  const [menuVisible, setMenuVisible] = useState(false);

  // Filtrar servicios publicados
  const publishedServices = useMemo(() => {
    return state.services.filter(
      (service) => (service.status?.toLowerCase() || '').trim() === 'publicado'
    );
  }, [state.services]);

  const handleServicePress = (service) => {
    if (!navigation) return;
    
    // Navegar a detalle del servicio para ver toda la información
    navigation.navigate('ServiceDetail', { serviceId: service.id });
  };

  const renderService = ({ item: service }) => (
    <PublicServiceCard
      service={service}
      onPress={() => handleServicePress(service)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con menú */}
      <View style={styles.topHeader}>
        <MenuButton onPress={() => setMenuVisible(true)} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MARKET DEL ESTE</Text>
          <Text style={styles.headerSubtitle}>
            {currentUser?.role === 'Proveedor de Servicio' ? 'Proveedor de Servicio' : 'Proveedor de Insumos'}
          </Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardHeaderTitle}>
            Servicios Disponibles para Cotizar
          </Text>
          <Text style={styles.dashboardSubtitle}>
            Selecciona un servicio para enviar tu cotización u oferta
          </Text>
        </View>

        {/* Lista de servicios */}
        {publishedServices.length > 0 ? (
          <View style={styles.servicesSection}>
            {publishedServices.map((service) => (
              <PublicServiceCard
                key={service.id}
                service={service}
                onPress={() => handleServicePress(service)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No hay servicios publicados en este momento.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Los servicios aparecerán aquí cuando los solicitantes los publiquen.
            </Text>
          </View>
        )}
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
  servicesSection: {
    padding: 20,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
    margin: 20,
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
  },
});

