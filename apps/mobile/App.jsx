import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GlobalStateProvider, useAppState } from '../../../packages/core-logic/src/context/GlobalStateContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardRouter from './src/screens/DashboardRouter';

const Stack = createNativeStackNavigator();

/**
 * AppNavigator - Componente de navegación principal
 * Maneja la navegación condicional basada en el estado de autenticación
 */
function AppNavigator() {
  const { state } = useAppState();
  const currentUser = state.currentUser;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          // Si no hay usuario autenticado, mostrar LoginScreen
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // Si hay usuario autenticado, mostrar DashboardRouter
          <Stack.Screen name="Dashboard" component={DashboardRouter} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * App - Componente principal de la aplicación React Native
 * Punto de entrada de la aplicación móvil
 * F6.HU1: Configura Stack Navigator y conecta con Core Logic
 */
export default function App() {
  return (
    <GlobalStateProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </GlobalStateProvider>
  );
}

