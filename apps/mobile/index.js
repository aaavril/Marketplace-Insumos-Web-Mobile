/**
 * index.js - PUNTO DE ENTRADA PRINCIPAL DE LA APLICACIÓN MOBILE
 * 
 * Este archivo es el primer archivo JavaScript que se ejecuta cuando
 * Expo inicia la aplicación mobile. Su función principal es:
 * 1. Cargar los polyfills necesarios (localStorage, etc.)
 * 2. Importar el componente raíz (App)
 * 3. Registrar App como el componente raíz de Expo
 * 
 * Flujo de ejecución:
 * Expo inicia → index.js → polyfills.js → App.jsx → AppNavigator → Pantallas
 * 
 * ¿Cómo funciona registerRootComponent?
 * - Es una función de Expo que registra el componente principal
 * - Expo renderiza este componente en la pantalla del dispositivo
 * - Similar a ReactDOM.render() en web, pero para React Native
 */

// registerRootComponent: Función de Expo para registrar el componente raíz de la app
import { registerRootComponent } from 'expo';

// Polyfills: Carga polyfills necesarios ANTES de importar App
// Esto asegura que localStorage y otras APIs estén disponibles cuando App se ejecute
import './polyfills';

// Componente raíz de la aplicación que contiene toda la lógica
import App from './App';

/**
 * Registra App como el componente raíz de la aplicación
 * 
 * registerRootComponent():
 * - Registra el componente App con Expo
 * - Expo renderiza este componente en la pantalla del dispositivo
 * - Este es el equivalente a ReactDOM.createRoot() en web
 * 
 * IMPORTANTE: Este debe ser el único lugar donde se llama registerRootComponent
 * Solo puede haber un componente raíz en una app de Expo
 */
registerRootComponent(App);

