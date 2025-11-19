import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Categorías disponibles
  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'piscinas', label: 'Piscinas' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'construccion', label: 'Construcción' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'otros', label: 'Otros' }
  ];

  // Filtrar servicios publicados con filtros avanzados
  const publishedServices = useMemo(() => {
    return state.services.filter((service) => {
      if ((service.status?.toLowerCase() || '').trim() !== 'publicado') return false;

      // Filtro por categoría
      const matchesCategory = !categoryFilter || service.category === categoryFilter;

      // Filtro por ubicación
      const matchesLocation = !locationFilter || 
        (service.location && service.location.toLowerCase().includes(locationFilter.toLowerCase()));

      // Búsqueda por texto (título o descripción)
      const matchesSearch = !searchQuery || 
        (service.title && service.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [state.services, categoryFilter, locationFilter, searchQuery]);

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

        {/* Búsqueda y Filtros */}
        <View style={styles.filterSection}>
          <View style={styles.searchHeader}>
            <Text style={styles.sectionTitle}>Filtros</Text>
            <TouchableOpacity
              style={styles.filterToggleButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={styles.filterToggleText}>
                {showFilters ? '✕ Ocultar' : '🔍 Filtros'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Búsqueda */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por título o descripción..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filtros avanzados */}
          {showFilters && (
            <View style={styles.advancedFiltersContainer}>
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Categoría:</Text>
                <TouchableOpacity
                  style={styles.filterPicker}
                  onPress={() => {
                    Alert.alert(
                      'Filtrar por Categoría',
                      '',
                      [
                        ...categories.map((cat) => ({
                          text: cat.label,
                          onPress: () => setCategoryFilter(cat.value),
                        })),
                        { text: 'Limpiar', onPress: () => setCategoryFilter(''), style: 'destructive' },
                        { text: 'Cancelar', style: 'cancel' },
                      ],
                      { cancelable: true }
                    );
                  }}
                >
                  <Text style={styles.filterPickerText}>
                    {categoryFilter
                      ? categories.find((c) => c.value === categoryFilter)?.label || 'Todas'
                      : 'Todas'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Ubicación:</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Filtrar por ubicación..."
                  placeholderTextColor="#999"
                  value={locationFilter}
                  onChangeText={setLocationFilter}
                />
              </View>

              {(categoryFilter || locationFilter || searchQuery) && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setCategoryFilter('');
                    setLocationFilter('');
                    setSearchQuery('');
                  }}
                >
                  <Text style={styles.clearFiltersText}>Limpiar todos los filtros</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  filterSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 20,
    marginTop: 20,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  filterToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  filterToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  advancedFiltersContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 90,
    marginRight: 8,
  },
  filterPicker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  filterPickerText: {
    fontSize: 14,
    color: '#333',
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  clearFiltersButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 6,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

