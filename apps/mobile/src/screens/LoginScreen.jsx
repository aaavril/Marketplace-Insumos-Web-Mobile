import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import { login } from '../../../../packages/core-logic/src/services/AuthService';

/**
 * LoginScreen - Pantalla de inicio de sesión
 * F6.HU2: Implementa login con AuthService y dispatch SET_CURRENT_USER
 * Permite a los usuarios autenticarse en la aplicación móvil
 */
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAppState();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // F6.HU2: Usar AuthService.login del core-logic
      const userData = await login(email, password);
      
      // F6.HU2: Dispatch SET_CURRENT_USER al reducer compartido
      dispatch({ type: 'SET_CURRENT_USER', payload: userData });
      
      // La navegación se manejará automáticamente por AppNavigator
      // al detectar que currentUser ya no es null
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MARKET DEL ESTE</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        ¿No tienes una cuenta?{' '}
        <Text style={styles.linkText}>Regístrate aquí</Text>
      </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 30,
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

