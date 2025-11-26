/**
 * DashboardRouter.jsx - ROUTER DE DASHBOARDS SEGÚN ROL
 * 
 * Este componente implementa el control de acceso por rol.
 * Renderiza condicionalmente el dashboard correspondiente según el rol del usuario.
 * 
 * Equivalente a RoleDashboard en web, pero adaptado para React Native.
 * 
 * Funcionalidad:
 * - Obtiene el rol del usuario del estado global
 * - Renderiza el dashboard específico según el rol:
 *   - "Solicitante" → SolicitanteDashboard
 *   - "Proveedor de Servicio" → ProveedorServicioDashboard
 *   - "Proveedor de Insumos" → ProveedorInsumosDashboard
 * - Maneja el logout y redirige a Login
 * 
 * Navegación:
 * - Recibe `navigation` como prop (de React Navigation)
 * - Puede navegar a otras pantallas usando navigation.navigate()
 * - Puede reemplazar la pantalla actual usando navigation.replace()
 */

// React: Biblioteca principal
import React from 'react';

// React Native: Componentes nativos
// View: Contenedor (equivalente a <div>)
// Text: Texto (equivalente a <span> o <p>)
// StyleSheet: Para crear estilos
// TouchableOpacity: Botón presionable (equivalente a <button>)
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// useAppState: Hook para acceder al estado global
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';

// Importar los dashboards específicos por rol
import SolicitanteDashboard from './SolicitanteDashboard';
import ProveedorServicioDashboard from './ProveedorServicioDashboard';
import ProveedorInsumosDashboard from './ProveedorInsumosDashboard';

/**
 * DashboardRouter - Router que muestra el dashboard según el rol del usuario
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.navigation - Objeto de navegación de React Navigation
 * 
 * @returns {JSX.Element} Dashboard específico según el rol del usuario
 * 
 * Este componente:
 * 1. Obtiene el usuario actual del estado global
 * 2. Determina su rol
 * 3. Renderiza el dashboard correspondiente
 * 4. Pasa navigation y onLogout como props a cada dashboard
 */
export default function DashboardRouter({ navigation }) {
  // Obtiene el estado global y la función dispatch
  const { state, dispatch } = useAppState();
  
  // Obtiene el usuario actual del estado global
  const currentUser = state.currentUser;
  
  // Obtiene el rol del usuario (ej: "Solicitante", "Proveedor de Servicio", etc.)
  const userRole = currentUser?.role;

  /**
   * Maneja el cierre de sesión del usuario
   * 
   * Esta función:
   * 1. Limpia el usuario del estado global (lo pone en null)
   * 2. Reemplaza la pantalla actual con Login usando navigation.replace()
   * 
   * navigation.replace() vs navigation.navigate():
   * - replace(): Reemplaza la pantalla actual (no se puede volver atrás)
   * - navigate(): Agrega una nueva pantalla (se puede volver atrás)
   * 
   * Usamos replace() porque después del logout no tiene sentido poder volver al dashboard
   */
  const handleLogout = () => {
    // Limpia el usuario del estado global
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    
    // Reemplaza la pantalla actual con Login
    // replace() elimina el Dashboard del stack de navegación
    navigation.replace('Login');
  };

  /**
   * Renderiza el dashboard según el rol del usuario
   * 
   * Usa un switch statement para renderizar condicionalmente:
   * - Cada caso renderiza el dashboard correspondiente
   - Pasa navigation y onLogout como props a cada dashboard
   * - default: Muestra un error si el rol no es reconocido
   * 
   * @returns {JSX.Element} Dashboard específico según el rol
   */
  const renderDashboardByRole = () => {
    switch (userRole) {
      // Dashboard para Solicitantes
      case 'Solicitante':
        return (
          <SolicitanteDashboard 
            navigation={navigation} 
            onLogout={handleLogout} 
          />
        );
      
      // Dashboard para Proveedores de Servicio
      case 'Proveedor de Servicio':
        return (
          <ProveedorServicioDashboard 
            navigation={navigation} 
            onLogout={handleLogout} 
          />
        );
      
      // Dashboard para Proveedores de Insumos
      case 'Proveedor de Insumos':
        return (
          <ProveedorInsumosDashboard 
            navigation={navigation} 
            onLogout={handleLogout} 
          />
        );
      
      // Fallback: Si el rol no es reconocido, muestra un error
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.errorText}>
              Rol no reconocido: {userRole || 'Sin rol'}
            </Text>
            {/* Botón para cerrar sesión si hay un problema con el rol */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  // Renderiza el dashboard correspondiente
  return renderDashboardByRole();
}

/**
 * Estilos del componente usando StyleSheet
 * 
 * En React Native, los estilos se definen con objetos JavaScript,
 * no con CSS como en web.
 */
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,                    // Ocupa todo el espacio disponible
    backgroundColor: '#fff',    // Fondo blanco
    alignItems: 'center',       // Centra horizontalmente
    justifyContent: 'center',   // Centra verticalmente
    padding: 20,                // Padding interno
  },
  // Título (no se usa actualmente, pero está disponible)
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  // Subtítulo (no se usa actualmente, pero está disponible)
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  // Texto de error para roles no reconocidos
  errorText: {
    fontSize: 16,
    color: '#ff3b30',           // Rojo para indicar error
    marginBottom: 20,
    textAlign: 'center',
  },
  // Botón de logout
  logoutButton: {
    backgroundColor: '#ff3b30', // Rojo para indicar acción destructiva
    borderRadius: 8,            // Bordes redondeados
    padding: 15,                // Padding interno
    alignItems: 'center',       // Centra el texto del botón
    marginTop: 20,
    minWidth: 150,              // Ancho mínimo
  },
  // Texto del botón de logout
  logoutButtonText: {
    color: '#fff',              // Texto blanco
    fontSize: 16,
    fontWeight: '600',          // Peso de fuente semi-bold
  },
});

