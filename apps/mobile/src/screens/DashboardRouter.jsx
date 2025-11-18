import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import SolicitanteDashboard from './SolicitanteDashboard';

/**
 * DashboardRouter - Router de dashboards según el rol del usuario
 */
export default function DashboardRouter({ navigation }) {
  const { state, dispatch } = useAppState();
  const currentUser = state.currentUser;
  const userRole = currentUser?.role;

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    navigation.replace('Login');
  };

  const renderDashboardByRole = () => {
    switch (userRole) {
      case 'Solicitante':
        return <SolicitanteDashboard navigation={navigation} onLogout={handleLogout} />;
      case 'Proveedor de Servicio':
        return <ProveedorServicioDashboard navigation={navigation} onLogout={handleLogout} />;
      case 'Proveedor de Insumos':
        return <ProveedorInsumosDashboard navigation={navigation} onLogout={handleLogout} />;
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.errorText}>Rol no reconocido: {userRole || 'Sin rol'}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return renderDashboardByRole();
}


/**
 * ProveedorServicioDashboard - Dashboard para Proveedores de Servicio
 */
function ProveedorServicioDashboard({ navigation, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard - Proveedor de Servicio</Text>
      <Text style={styles.subtitle}>Bienvenido, Proveedor de Servicio</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * ProveedorInsumosDashboard - Dashboard para Proveedores de Insumos
 */
function ProveedorInsumosDashboard({ navigation, onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard - Proveedor de Insumos</Text>
      <Text style={styles.subtitle}>Bienvenido, Proveedor de Insumos</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    minWidth: 150,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

