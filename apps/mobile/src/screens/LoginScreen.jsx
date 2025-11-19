/**
 * LoginScreen.jsx - PANTALLA DE INICIO DE SESIÓN (MOBILE)
 * 
 * Esta pantalla permite a los usuarios autenticarse en la aplicación mobile.
 * 
 * Funcionalidades:
 * - Formulario de login con email y contraseña
 * - Validación de campos obligatorios
 * - Estado de carga durante el proceso de login
 * - Navegación automática al dashboard después del login exitoso
 * - Manejo de errores con Alert nativo
 * 
 * Navegación:
 * - Si el usuario ya está autenticado → Redirige automáticamente a Dashboard
 * - Después de login exitoso → Navega a Dashboard
 * 
 * Diferencias con Web:
 * - Usa Alert.alert() en lugar de mensajes en la UI
 * - Usa TextInput en lugar de <input>
 * - Usa TouchableOpacity en lugar de <button>
 * - Recibe navigation como prop (no usa useNavigate hook)
 */

// React: Hooks para estado y efectos
import React, { useState, useEffect } from 'react';

// React Native: Componentes nativos
// View: Contenedor
// Text: Texto
// StyleSheet: Estilos
// TextInput: Campo de entrada de texto (equivalente a <input>)
// TouchableOpacity: Botón presionable (equivalente a <button>)
// Alert: Diálogo nativo de alerta
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

// useAppState: Hook para acceder al estado global
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';

// login: Función del servicio de autenticación
import { login } from '../../../../packages/core-logic/src/services/AuthService';

/**
 * LoginScreen - Pantalla de inicio de sesión
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.navigation - Objeto de navegación de React Navigation
 * 
 * @returns {JSX.Element} Pantalla de login con formulario
 * 
 * Esta pantalla:
 * 1. Muestra un formulario de login (email y contraseña)
 * 2. Valida que los campos estén completos
 * 3. Llama al servicio de autenticación
 * 4. Actualiza el estado global con el usuario autenticado
 * 5. Navega automáticamente al dashboard después del login exitoso
 */
export default function LoginScreen({ navigation }) {
  // Estado local: Email del usuario
  const [email, setEmail] = useState('');
  
  // Estado local: Contraseña del usuario
  const [password, setPassword] = useState('');
  
  // Estado local: Indica si el login está en proceso
  const [loading, setLoading] = useState(false);
  
  // Obtiene el estado global y la función dispatch
  const { state, dispatch } = useAppState();
  
  // Obtiene el usuario actual del estado global
  const currentUser = state.currentUser;

  /**
   * useEffect: Navegación automática cuando el usuario se autentica
   * 
   * Este efecto se ejecuta cuando:
   * - El componente se monta
   * - currentUser cambia (después de un login exitoso)
   * - navigation cambia (raro, pero posible)
   * 
   * Si el usuario ya está autenticado, redirige automáticamente al Dashboard.
   * Esto evita que usuarios ya logueados vean la pantalla de login.
   */
  useEffect(() => {
    if (currentUser && navigation) {
      // replace() reemplaza Login con Dashboard en el stack de navegación
      // Esto evita que el usuario pueda volver atrás a Login usando el botón "atrás"
      navigation.replace('Dashboard');
    }
  }, [currentUser, navigation]);

  /**
   * Maneja el proceso de login del usuario
   * 
   * Flujo:
   * 1. Valida que email y password no estén vacíos
   * 2. Muestra estado de carga
   * 3. Llama al servicio de autenticación
   * 4. Si es exitoso → Actualiza el estado global con el usuario
   * 5. Si falla → Muestra un Alert con el error
   * 6. Siempre → Oculta el estado de carga
   * 
   * Nota: La navegación al Dashboard se hace automáticamente en el useEffect
   * cuando currentUser cambia después de dispatch.
   */
  const handleLogin = async () => {
    // Validación: Verifica que ambos campos estén completos
    if (!email || !password) {
      // Alert.alert() muestra un diálogo nativo de alerta
      // Equivalente a window.alert() en web, pero con mejor UX en mobile
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Activa el estado de carga (deshabilita botones y muestra "Ingresando...")
    setLoading(true);
    
    try {
      // Llama al servicio de autenticación (compartido con web)
      // Este servicio valida las credenciales contra usuarios mock
      const userData = await login(email, password);
      
      // Actualiza el estado global con el usuario autenticado
      // Esto dispara el useEffect que navega al Dashboard
      dispatch({ type: 'SET_CURRENT_USER', payload: userData });
      
      // Nota: No navegamos manualmente aquí porque el useEffect lo hace automáticamente
    } catch (error) {
      // Si hay un error (credenciales inválidas, etc.), muestra un Alert
      Alert.alert(
        'Error', 
        error.message || 'No se pudo iniciar sesión. Intenta nuevamente.'
      );
    } finally {
      // Siempre oculta el estado de carga, sin importar si fue exitoso o falló
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Título principal de la aplicación */}
      <Text style={styles.title}>MARKET DEL ESTE</Text>
      
      {/* Subtítulo descriptivo */}
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      {/* Formulario de login */}
      <View style={styles.form}>
        {/* Campo de entrada para email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}              // Actualiza el estado email cuando el usuario escribe
          keyboardType="email-address"          // Muestra teclado optimizado para email (@, .com, etc.)
          autoCapitalize="none"                 // No capitaliza automáticamente (emails no tienen mayúsculas)
          editable={!loading}                   // Deshabilita el campo durante el login
        />

        {/* Campo de entrada para contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}            // Actualiza el estado password cuando el usuario escribe
          secureTextEntry                       // Oculta el texto (muestra puntos en lugar de caracteres)
          editable={!loading}                   // Deshabilita el campo durante el login
        />

        {/* Botón de login */}
        <TouchableOpacity
          // Estilos condicionales: Si está loading, aplica buttonDisabled
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}                 // Maneja el click/touch
          disabled={loading}                    // Deshabilita el botón durante el login
        >
          <Text style={styles.buttonText}>
            {/* Texto dinámico según el estado de carga */}
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Texto del footer (actualmente no es clickeable, solo informativo) */}
      <Text style={styles.footerText}>
        ¿No tienes una cuenta?{' '}
        <Text style={styles.linkText}>Regístrate aquí</Text>
      </Text>
    </View>
  );
}

/**
 * Estilos de la pantalla de login usando StyleSheet
 * 
 * En React Native, los estilos se definen con objetos JavaScript usando StyleSheet.create().
 * Esto es diferente a web donde se usa CSS.
 * 
 * Ventajas de StyleSheet.create():
 * - Mejor rendimiento (se optimiza)
 * - Validación de propiedades
 * - Mejor organización del código
 */
const styles = StyleSheet.create({
  // Contenedor principal de la pantalla
  container: {
    flex: 1,                    // Ocupa todo el espacio disponible (100% de altura)
    backgroundColor: '#fff',     // Fondo blanco
    alignItems: 'center',       // Centra los elementos horizontalmente
    justifyContent: 'center',   // Centra los elementos verticalmente
    padding: 20,                // Padding interno de 20px
  },
  // Título principal "MARKET DEL ESTE"
  title: {
    fontSize: 28,              // Tamaño de fuente grande
    fontWeight: 'bold',         // Texto en negrita
    marginBottom: 10,           // Margen inferior
    color: '#333',              // Color de texto gris oscuro
  },
  // Subtítulo "Inicia sesión para continuar"
  subtitle: {
    fontSize: 16,              // Tamaño de fuente mediano
    color: '#666',             // Color de texto gris
    marginBottom: 40,           // Margen inferior grande (espacio antes del formulario)
  },
  // Contenedor del formulario
  form: {
    width: '100%',              // Ancho completo del contenedor padre
    maxWidth: 400,              // Ancho máximo de 400px (para tablets/pantallas grandes)
  },
  // Estilo para los campos de entrada (TextInput)
  input: {
    borderWidth: 1,             // Grosor del borde (1px)
    borderColor: '#ddd',        // Color del borde gris claro
    borderRadius: 8,            // Bordes redondeados
    padding: 15,                // Padding interno
    marginBottom: 15,            // Margen inferior entre campos
    fontSize: 16,               // Tamaño de fuente
    backgroundColor: '#fff',    // Fondo blanco
  },
  // Botón de login (estado normal)
  button: {
    backgroundColor: '#007AFF', // Color azul iOS estándar
    borderRadius: 8,            // Bordes redondeados
    padding: 15,                // Padding interno
    alignItems: 'center',       // Centra el texto del botón
    marginTop: 10,              // Margen superior
  },
  // Botón de login (estado deshabilitado durante loading)
  buttonDisabled: {
    backgroundColor: '#ccc',    // Color gris cuando está deshabilitado
  },
  // Texto del botón
  buttonText: {
    color: '#fff',              // Texto blanco
    fontSize: 16,               // Tamaño de fuente
    fontWeight: '600',          // Peso de fuente semi-bold
  },
  // Texto del footer
  footerText: {
    marginTop: 30,              // Margen superior grande
    fontSize: 14,               // Tamaño de fuente pequeño
    color: '#666',             // Color de texto gris
  },
  // Texto del enlace "Regístrate aquí"
  linkText: {
    color: '#007AFF',           // Color azul para indicar que es clickeable
    fontWeight: '600',          // Peso de fuente semi-bold
  },
});

