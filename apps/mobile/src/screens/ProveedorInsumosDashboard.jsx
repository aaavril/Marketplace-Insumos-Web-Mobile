import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import SummaryCard from '../components/SummaryCard';
import MenuButton from '../components/MenuButton';
import MenuDrawer from '../components/MenuDrawer';

/**
 * ProveedorInsumosDashboard - Dashboard para usuarios con rol Proveedor de Insumos
 * Replica las funcionalidades del dashboard web adaptadas a mobile
 * Muestra las ofertas de packs de insumos publicadas por el proveedor
 */
export default function ProveedorInsumosDashboard({ navigation, onLogout }) {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  const [menuVisible, setMenuVisible] = useState(false);

  // Ofertas publicadas por el proveedor
  const myOffers = useMemo(
    () =>
      state.supplyOffers.filter(
        (offer) => offer.providerId === currentUser?.id
      ),
    [state.supplyOffers, currentUser?.id]
  );

  // Estadísticas
  const totalOfertas = myOffers.length;
  const totalValor = myOffers.reduce((sum, offer) => sum + (offer.totalPrice || 0), 0);
  const totalItems = myOffers.reduce(
    (sum, offer) => sum + (offer.items?.length || 0),
    0
  );

  const handlePublicarPack = () => {
    if (navigation) {
      navigation.navigate('SupplyOfferForm');
    }
  };

  const handleVerServicios = () => {
    if (navigation) {
      navigation.navigate('ServiceList');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con menú */}
      <View style={styles.topHeader}>
        <MenuButton onPress={() => setMenuVisible(true)} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>MARKET DEL ESTE</Text>
          <Text style={styles.headerSubtitle}>Proveedor de Insumos</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Título principal */}
        <View style={styles.dashboardHeader}>
          <Text style={styles.dashboardHeaderTitle}>
            Gestiona tus packs de insumos
          </Text>
          <Text style={styles.dashboardSubtitle}>
            Centraliza tus ofertas publicadas y mantenlas actualizadas
          </Text>
        </View>

        {/* Botones de acción */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePublicarPack}
          >
            <Text style={styles.actionButtonText}>Publicar pack de insumos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleVerServicios}
          >
            <Text style={styles.secondaryButtonText}>Ver servicios disponibles</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjetas de resumen */}
        <View style={styles.summaryCardsContainer}>
          <View style={styles.summaryCards}>
            <SummaryCard label="Ofertas publicadas" value={totalOfertas} />
            <SummaryCard label="Total insumos" value={totalItems} />
          </View>
        </View>

        {/* Sección de ofertas */}
        <View style={styles.offersSection}>
          <Text style={styles.sectionTitle}>Mis Ofertas Publicadas</Text>

          {myOffers.length > 0 ? (
            <View style={styles.offersList}>
              {myOffers.map((offer) => (
                <View key={offer.id} style={styles.offerCard}>
                  <View style={styles.offerHeader}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <View style={styles.offerPriceBadge}>
                      <Text style={styles.offerPrice}>
                        USD {offer.totalPrice.toLocaleString('es-UY', {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  </View>

                  {offer.description && (
                    <Text style={styles.offerDescription}>{offer.description}</Text>
                  )}

                  <View style={styles.offerItems}>
                    <Text style={styles.offerItemsTitle}>Insumos incluidos:</Text>
                    {offer.items && offer.items.length > 0 ? (
                      <View style={styles.itemsList}>
                        {offer.items.map((item, index) => (
                          <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemName}>
                              <Text style={styles.itemNameBold}>{item.name}</Text>
                              {(item.quantity || item.unit) && (
                                <Text style={styles.itemDetails}>
                                  {' '}- {item.quantity || ''}
                                  {item.unit ? ` ${item.unit}` : ''}
                                </Text>
                              )}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noItemsText}>Sin insumos especificados</Text>
                    )}
                  </View>

                  {offer.createdAt && (
                    <Text style={styles.offerDate}>
                      📅 Publicado: {new Date(offer.createdAt).toLocaleDateString('es-UY')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No tienes ofertas publicadas
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Crea tu primera oferta usando el botón de arriba.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handlePublicarPack}
              >
                <Text style={styles.emptyStateButtonText}>
                  Publicar mi primera oferta
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
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
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
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
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
  offersSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  offersList: {
    gap: 16,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  offerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginRight: 12,
    lineHeight: 24,
  },
  offerPriceBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  offerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  offerItems: {
    marginBottom: 12,
  },
  offerItemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    paddingLeft: 8,
  },
  itemName: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  itemNameBold: {
    fontWeight: '600',
    color: '#333',
  },
  itemDetails: {
    fontSize: 13,
    color: '#888',
  },
  noItemsText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    paddingLeft: 8,
  },
  offerDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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

