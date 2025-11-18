import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';

/**
 * MenuDrawer - Menú lateral accesible desde el dashboard
 * @param {boolean} visible - Controla si el menú está visible
 * @param {Function} onClose - Función que se ejecuta al cerrar el menú
 * @param {Function} onLogout - Función que se ejecuta al cerrar sesión
 * @param {Object} navigation - Objeto de navegación de React Navigation
 */
export default function MenuDrawer({ visible, onClose, onLogout, navigation }) {
  const { state } = useAppState();
  const currentUser = state.currentUser;

  const handleMenuOption = (option) => {
    onClose();
    
    switch (option) {
      case 'profile':
        // TODO: Navegar a perfil cuando se implemente
        console.log('Ver perfil');
        break;
      case 'services':
        // Navegar al dashboard (ya estamos ahí, pero útil si estamos en otra pantalla)
        if (navigation) {
          navigation.navigate('Dashboard');
        }
        break;
      case 'create':
        // Navegar a crear servicio (Solicitante)
        if (navigation) {
          navigation.navigate('ServiceForm');
        }
        break;
      case 'availableServices':
        // Navegar a servicios disponibles (Proveedor de Servicio)
        if (navigation) {
          navigation.navigate('ServiceList');
        }
        break;
      case 'createOffer':
        // Navegar a crear oferta de pack (Proveedor de Insumos)
        if (navigation) {
          navigation.navigate('SupplyOfferForm');
        }
        break;
      case 'logout':
        onLogout();
        break;
      default:
        break;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.drawer}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Menú</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.content}>
                {/* Información del usuario */}
                <View style={styles.userSection}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <Text style={styles.userName}>{currentUser?.name || 'Usuario'}</Text>
                  <Text style={styles.userEmail}>{currentUser?.email || ''}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{currentUser?.role || ''}</Text>
                  </View>
                </View>

                {/* Opciones del menú */}
                <View style={styles.menuSection}>
                  {currentUser?.role === 'Solicitante' ? (
                    <>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleMenuOption('services')}
                      >
                        <Text style={styles.menuIcon}>📋</Text>
                        <Text style={styles.menuText}>Mis Servicios</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleMenuOption('create')}
                      >
                        <Text style={styles.menuIcon}>➕</Text>
                        <Text style={styles.menuText}>Publicar Servicio</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      {currentUser?.role === 'Proveedor de Servicio' && (
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => handleMenuOption('services')}
                        >
                          <Text style={styles.menuIcon}>📋</Text>
                          <Text style={styles.menuText}>Mis Servicios</Text>
                        </TouchableOpacity>
                      )}

                      {currentUser?.role === 'Proveedor de Servicio' && (
                        <TouchableOpacity
                          style={styles.menuItem}
                          onPress={() => handleMenuOption('availableServices')}
                        >
                          <Text style={styles.menuIcon}>🔍</Text>
                          <Text style={styles.menuText}>Servicios Disponibles</Text>
                        </TouchableOpacity>
                      )}

                      {currentUser?.role === 'Proveedor de Insumos' && (
                        <>
                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('services')}
                          >
                            <Text style={styles.menuIcon}>📋</Text>
                            <Text style={styles.menuText}>Mis Ofertas</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('availableServices')}
                          >
                            <Text style={styles.menuIcon}>🔍</Text>
                            <Text style={styles.menuText}>Servicios Disponibles</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleMenuOption('createOffer')}
                          >
                            <Text style={styles.menuIcon}>📦</Text>
                            <Text style={styles.menuText}>Publicar Pack</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleMenuOption('profile')}
                  >
                    <Text style={styles.menuIcon}>👤</Text>
                    <Text style={styles.menuText}>Mi Perfil</Text>
                  </TouchableOpacity>
                </View>

                {/* Separador */}
                <View style={styles.divider} />

                {/* Opción de cerrar sesión */}
                <TouchableOpacity
                  style={styles.logoutItem}
                  onPress={() => handleMenuOption('logout')}
                >
                  <Text style={styles.logoutIcon}>🚪</Text>
                  <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawer: {
    width: '85%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  userSection: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
  },
  menuSection: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff5f5',
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
});

