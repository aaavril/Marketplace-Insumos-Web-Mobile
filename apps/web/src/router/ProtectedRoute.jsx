/**
 * ProtectedRoute.jsx - COMPONENTE PARA PROTEGER RUTAS
 * 
 * Este componente envuelve rutas que requieren autenticación.
 * Verifica si el usuario está autenticado antes de permitir el acceso.
 * 
 * Funcionamiento:
 * 1. Verifica si el usuario está autenticado usando el hook useAuth()
 * 2. Si NO está autenticado → Redirige a /login
 * 3. Si está autenticado → Permite el acceso y renderiza el componente hijo
 * 
 * Uso:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * 
 * Este componente se usa en AppRouter.jsx para proteger rutas privadas.
 */

// Navigate: Componente de React Router para redireccionar a otra ruta
import { Navigate } from 'react-router-dom';

// useAuth: Hook personalizado para acceder al contexto de autenticación
import { useAuth } from '@core-logic/context/AuthContext';

/**
 * ProtectedRoute - Componente wrapper que protege rutas privadas
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componente hijo que se renderizará si el usuario está autenticado
 * 
 * @returns {JSX.Element} 
 * - Si autenticado: Renderiza el componente hijo (children)
 * - Si NO autenticado: Redirige a /login usando <Navigate />
 * 
 * Ejemplos de rutas que usan ProtectedRoute:
 * - /dashboard → Solo visible si estás logueado
 * - /services → Solo visible si estás logueado
 * - /profile → Solo visible si estás logueado
 */
const ProtectedRoute = ({ children }) => {
  // Obtiene el estado de autenticación del contexto
  // isAuthenticated es true si hay un usuario logueado, false si no
  const { isAuthenticated } = useAuth();

  // Si el usuario NO está autenticado, redirige al login
  // replace: true reemplaza la entrada del historial en lugar de agregar una nueva
  // Esto evita que el usuario pueda volver atrás a la página protegida usando el botón "atrás"
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, permite el acceso y renderiza el componente hijo
  // children es el componente que estaba envuelto (ej: <DashboardPage />)
  return children;
};

export default ProtectedRoute;


