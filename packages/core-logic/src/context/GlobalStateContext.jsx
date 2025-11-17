import { createContext, useContext, useReducer } from 'react';
import { initialState } from '../data/initialState';
import { AppReducer } from './AppReducer';

/**
 * Context para el estado global de la aplicación
 */
export const StateContext = createContext();

/**
 * GlobalStateProvider - Proveedor del estado global
 * Envuelve la aplicación y proporciona acceso al estado y dispatch
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

/**
 * useAppState - Custom hook para acceder al estado global
 * Facilita el acceso al state y dispatch desde cualquier componente
 * 
 * @returns {Object} - { state, dispatch }
 * @throws {Error} - Si se usa fuera del GlobalStateProvider
 */
export const useAppState = () => {
  const context = useContext(StateContext);
  
  if (!context) {
    throw new Error('useAppState debe usarse dentro de GlobalStateProvider');
  }
  
  return context;
};

