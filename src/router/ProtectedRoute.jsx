import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - Ruta protegida que requiere autenticación
 * Usa este componente para rutas que requieren estar logueado
 * (ej: Dashboard, Perfil, Servicios, etc.)
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Si no estás autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si estás autenticado, permite acceso
  return children;
};

export default ProtectedRoute;


