import { createContext, useContext, useState, useEffect } from 'react';
import { useAppState } from './GlobalStateContext';
import { login as authLogin, logout as authLogout } from '../services/AuthService';

/**
 * Context para autenticación
 * Usa GlobalStateContext internamente
 */
export const AuthContext = createContext(undefined);

/**
 * AuthProvider - Proveedor de autenticación
 * Wrapper sobre GlobalStateContext para autenticación específica
 */
export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Carga el usuario guardado en localStorage al iniciar
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        localStorage.removeItem('currentUser');
      }
    }
  }, [dispatch]);

  /**
   * Realiza el login del usuario
   */
  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const userData = await authLogin(email, password);
      
      // Guarda el usuario en localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      dispatch({ type: 'SET_CURRENT_USER', payload: userData });
      return userData;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Realiza el logout del usuario
   */
  const logout = async () => {
    setAuthLoading(true);
    try {
      await authLogout();
      
      // Elimina el usuario de localStorage
      localStorage.removeItem('currentUser');
      
      dispatch({ type: 'LOGOUT' });
      setAuthError(null);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  /**
   * Verifica si el usuario está autenticado
   */
  const isAuthenticated = !!state.currentUser;

  /**
   * Obtiene el rol del usuario actual
   */
  const getUserRole = () => state.currentUser?.role;

  const value = {
    user: state.currentUser,
    loading: authLoading,
    error: authError,
    isAuthenticated,
    login,
    logout,
    getUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth - Custom hook para acceder al contexto de autenticación
 * @returns {Object} - { user, loading, error, isAuthenticated, login, logout, getUserRole }
 * @throws {Error} - Si se usa fuera del AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
}

