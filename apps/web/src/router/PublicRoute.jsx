import { Navigate } from 'react-router-dom';
import { useAuth } from '@core-logic/context/AuthContext';

/**
 * PublicRoute - Ruta pública que redirige si ya estás autenticado
 * Usa este componente para rutas que solo deben verse cuando NO estás logueado
 * (ej: Login, Registro, etc.)
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Si ya estás autenticado, redirige al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no estás autenticado, permite acceso
  return children;
};

export default PublicRoute;


