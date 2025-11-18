// Importar polyfills primero
import './polyfills';

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GlobalStateProvider, useAppState } from '../../../packages/core-logic/src/context/GlobalStateContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardRouter from './src/screens/DashboardRouter';
import ServiceFormScreen from './src/screens/ServiceFormScreen';

const Stack = createNativeStackNavigator();

/**
 * ErrorBoundary - Captura errores de renderizado
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Algo salió mal</Text>
          <Text style={styles.errorText}>{this.state.error?.message || 'Error desconocido'}</Text>
          <Text style={styles.errorStack}>{this.state.error?.stack}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

/**
 * AppNavigator - Componente de navegación principal
 */
function AppNavigator() {
  let state, currentUser;
  
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

  try {
    return (
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName={currentUser ? "Dashboard" : "Login"}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardRouter} />
          <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
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
 * App - Componente principal
 */
export default function App() {
  console.log('App - Iniciando...');
  
  try {
    return (
      <ErrorBoundary>
        <GlobalStateProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </GlobalStateProvider>
      </ErrorBoundary>
    );
  } catch (error) {
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

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorStack: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
    fontFamily: 'monospace',
  },
});

