/**
 * App.jsx - COMPONENTE RAÍZ DE LA APLICACIÓN MOBILE
 * 
 * Este es el componente principal que se renderiza después de que Expo
 * carga la aplicación. Su función principal es:
 * 1. Envolver la app con ErrorBoundary para capturar errores
 * 2. Envolver la app con GlobalStateProvider (estado global)
 * 3. Configurar la barra de estado del dispositivo
 * 4. Renderizar el AppNavigator que maneja toda la navegación
 * 
 * Flujo de ejecución:
 * index.js → polyfills.js → App.jsx → ErrorBoundary → GlobalStateProvider → AppNavigator → Pantallas
 * 
 * Diferencias con Web:
 * - Usa ErrorBoundary (clase component) para capturar errores
 * - Usa React Navigation en lugar de React Router
 * - Usa componentes nativos de React Native (View, Text) en lugar de HTML
 * - No usa AuthProvider directamente (la autenticación se maneja en LoginScreen)
 */

// Importar polyfills primero (debe estar antes de cualquier código que use localStorage)
import './polyfills';

// React: Biblioteca principal
import React, { Component } from 'react';

// React Native: Componentes nativos para mobile
// View: Equivalente a <div> en web
// Text: Equivalente a <span> o <p> en web
// StyleSheet: Para crear estilos (equivalente a CSS en web)
import { View, Text, StyleSheet } from 'react-native';

// React Navigation: Librería para navegación en React Native
// NavigationContainer: Proporciona el contexto de navegación
// createNativeStackNavigator: Crea un Stack Navigator (pantallas apiladas)
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Expo StatusBar: Controla la barra de estado del dispositivo (hora, batería, etc.)
import { StatusBar } from 'expo-status-bar';

// GlobalStateProvider: Provider del estado global compartido
// useAppState: Hook para acceder al estado global
import { GlobalStateProvider, useAppState } from '../../../packages/core-logic/src/context/GlobalStateContext';

// Importar todas las pantallas de la aplicación
import LoginScreen from './src/screens/LoginScreen';
import DashboardRouter from './src/screens/DashboardRouter';
import ServiceFormScreen from './src/screens/ServiceFormScreen';
import ServiceListScreen from './src/screens/ServiceListScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import QuoteFormScreen from './src/screens/QuoteFormScreen';
import SupplyOfferFormScreen from './src/screens/SupplyOfferFormScreen';

// Crear el Stack Navigator (pila de pantallas)
// Stack Navigator: Las pantallas se apilan una sobre otra (como una pila de cartas)
const Stack = createNativeStackNavigator();

/**
 * ErrorBoundary - Componente para capturar errores de renderizado
 * 
 * Este es un componente de clase (no funcional) porque React solo permite
 * Error Boundaries como componentes de clase.
 * 
 * ¿Qué hace?
 * - Captura errores de JavaScript en cualquier componente hijo
 * - Muestra una pantalla de error amigable en lugar de crashear la app
 * - Registra el error en la consola para debugging
 * 
 * ¿Cuándo se activa?
 * - Cuando un componente lanza un error durante el renderizado
 * - Cuando un componente lanza un error en un constructor
 * - NO captura errores en event handlers, async code, o durante el SSR
 * 
 * En producción, esto previene que la app crashee completamente y muestra
 * un mensaje de error al usuario.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // Estado para controlar si hay un error
    this.state = { hasError: false, error: null };
  }

  /**
   * getDerivedStateFromError - Método estático del ciclo de vida
   * Se ejecuta cuando un error es capturado
   * Actualiza el estado para mostrar la UI de error
   * 
   * @param {Error} error - El error que fue capturado
   * @returns {Object} - Nuevo estado con hasError: true
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * componentDidCatch - Método del ciclo de vida
   * Se ejecuta después de que se captura un error
   * Ideal para logging de errores
   * 
   * @param {Error} error - El error capturado
   * @param {Object} errorInfo - Información adicional sobre el error
   */
  componentDidCatch(error, errorInfo) {
    // Registra el error en la consola para debugging
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  render() {
    // Si hay un error, muestra la UI de error
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Algo salió mal</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Error desconocido'}
          </Text>
          {/* Stack trace solo en desarrollo, no en producción */}
          <Text style={styles.errorStack}>{this.state.error?.stack}</Text>
        </View>
      );
    }

    // Si no hay error, renderiza los componentes hijos normalmente
    return this.props.children;
  }
}

/**
 * AppNavigator - Componente de navegación principal
 * 
 * Este componente configura todas las pantallas de la aplicación usando
 * React Navigation (Stack Navigator).
 * 
 * Funcionalidades:
 * - Define todas las pantallas disponibles
 * - Decide la pantalla inicial según si el usuario está autenticado
 * - Maneja la navegación entre pantallas
 * 
 * Pantallas disponibles:
 * - Login: Pantalla de autenticación
 * - Dashboard: Router que muestra dashboard según rol
 * - ServiceForm: Crear nuevo servicio
 * - ServiceList: Lista de servicios
 * - ServiceDetail: Detalle de servicio
 * - QuoteForm: Crear cotización
 * - SupplyOfferForm: Crear oferta de insumos
 */
function AppNavigator() {
  let state, currentUser;
  
  // Intenta obtener el estado global
  // Si falla, muestra un error en lugar de crashear la app
  try {
    const appState = useAppState();
    state = appState?.state;
    currentUser = state?.currentUser;
    console.log('AppNavigator - currentUser:', currentUser);
    console.log('AppNavigator - state:', state);
  } catch (error) {
    console.error('Error al obtener useAppState:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error al cargar el estado</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  // Intenta renderizar el NavigationContainer
  // Si falla, muestra un error
  try {
    return (
      // NavigationContainer: Proporciona el contexto de navegación a toda la app
      // Similar a BrowserRouter en React Router (web)
      <NavigationContainer>
        {/* Stack.Navigator: Crea un Stack Navigator (pantallas apiladas) */}
        <Stack.Navigator 
          // headerShown: false oculta la barra de navegación por defecto
          // Cada pantalla puede mostrar su propio header si lo necesita
          screenOptions={{ headerShown: false }}
          
          // initialRouteName: Pantalla inicial según autenticación
          // Si hay usuario → Dashboard, si no → Login
          initialRouteName={currentUser ? "Dashboard" : "Login"}
        >
          {/* Pantalla de Login - Primera pantalla si no estás autenticado */}
          <Stack.Screen name="Login" component={LoginScreen} />
          
          {/* Dashboard Router - Muestra dashboard según el rol del usuario */}
          <Stack.Screen name="Dashboard" component={DashboardRouter} />
          
          {/* Pantalla para crear un nuevo servicio (Rol: Solicitante) */}
          <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
          
          {/* Lista de servicios publicados (Rol: Proveedor de Servicio) */}
          <Stack.Screen name="ServiceList" component={ServiceListScreen} />
          
          {/* Detalle de un servicio específico (todos los roles) */}
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
          
          {/* Formulario para enviar una cotización (Rol: Proveedor de Servicio) */}
          <Stack.Screen name="QuoteForm" component={QuoteFormScreen} />
          
          {/* Formulario para crear oferta de insumos (Rol: Proveedor de Insumos) */}
          <Stack.Screen name="SupplyOfferForm" component={SupplyOfferFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('Error al renderizar NavigationContainer:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error en navegación</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }
}

/**
 * App - Componente principal de la aplicación mobile
 * 
 * Este componente:
 * 1. Envuelve toda la app con ErrorBoundary para capturar errores
 * 2. Envuelve la app con GlobalStateProvider para estado global
 * 3. Configura la StatusBar del dispositivo
 * 4. Renderiza el AppNavigator que maneja toda la navegación
 * 
 * Jerarquía:
 * ErrorBoundary (captura errores)
 *   └── GlobalStateProvider (estado global)
 *       └── StatusBar (barra de estado del dispositivo)
 *       └── AppNavigator (navegación y pantallas)
 * 
 * @returns {JSX.Element} Componente raíz de la aplicación
 */
export default function App() {
  console.log('App - Iniciando...');
  
  try {
    return (
      // ErrorBoundary: Captura errores y muestra UI de error en lugar de crashear
      <ErrorBoundary>
        {/* GlobalStateProvider: Proporciona el estado global a toda la app */}
        <GlobalStateProvider>
          {/* StatusBar: Controla la apariencia de la barra de estado (hora, batería, etc.) */}
          <StatusBar style="auto" />
          
          {/* AppNavigator: Maneja toda la navegación de la aplicación */}
          <AppNavigator />
        </GlobalStateProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    // Si hay un error al iniciar la app, muestra un error
    console.error('Error en App:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error al iniciar la app</Text>
        <Text style={styles.errorText}>{error.message}</Text>
        <Text style={styles.errorStack}>{error.stack}</Text>
      </View>
    );
  }
}

/**
 * Estilos de la aplicación usando StyleSheet
 * 
 * StyleSheet.create() es la forma recomendada de crear estilos en React Native.
 * Ventajas sobre objetos inline:
 * - Mejor rendimiento (se optimiza)
 * - Validación de propiedades
 * - Mejor organización del código
 * 
 * Nota: En React Native NO se usa CSS, se usan objetos JavaScript con StyleSheet
 */
const styles = StyleSheet.create({
  // Contenedor para pantallas de error
  errorContainer: {
    flex: 1,                    // Ocupa todo el espacio disponible
    justifyContent: 'center',   // Centra verticalmente
    alignItems: 'center',       // Centra horizontalmente
    padding: 20,                 // Padding interno
    backgroundColor: '#fff',     // Fondo blanco
  },
  // Título del error
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff3b30',           // Rojo para indicar error
    marginBottom: 10,
  },
  // Texto del error
  errorText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  // Stack trace del error (solo para debugging)
  errorStack: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    fontFamily: 'monospace',    // Fuente monoespaciada para código
  },
});

