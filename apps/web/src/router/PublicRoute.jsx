/**
 * PublicRoute.jsx - COMPONENTE PARA RUTAS PÚBLICAS
 * 
 * Este componente envuelve rutas que solo deben verse cuando NO estás autenticado.
 * Evita que usuarios ya logueados accedan a páginas como Login o SignUp.
 * 
 * Funcionamiento:
 * 1. Verifica si el usuario está autenticado usando el hook useAuth()
 * 2. Si YA está autenticado → Redirige a /dashboard (no tiene sentido ver Login si ya estás logueado)
 * 3. Si NO está autenticado → Permite el acceso y renderiza el componente hijo
 * 
 * Uso:
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * 
 * Este componente se usa en AppRouter.jsx para proteger rutas públicas.
 */

// Navigate: Componente de React Router para redireccionar a otra ruta
import { Navigate } from 'react-router-dom';

// useAuth: Hook personalizado para acceder al contexto de autenticación
import { useAuth } from '@core-logic/context/AuthContext';

/**
 * PublicRoute - Componente wrapper que protege rutas públicas
 * 
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componente hijo que se renderizará si el usuario NO está autenticado
 * 
 * @returns {JSX.Element}
 * - Si NO autenticado: Renderiza el componente hijo (children)
 * - Si YA autenticado: Redirige a /dashboard usando <Navigate />
 * 
 * Ejemplos de rutas que usan PublicRoute:
 * - /login → Solo visible si NO estás logueado (si ya estás logueado, redirige a /dashboard)
 * - /signup → Solo visible si NO estás logueado
 * 
 * ¿Por qué es útil?
 * Evita que un usuario ya autenticado acceda a páginas como Login/SignUp,
 * lo cual no tiene sentido y puede confundir al usuario.
 */
const PublicRoute = ({ children }) => {
  // Obtiene el estado de autenticación del contexto
  // isAuthenticated es true si hay un usuario logueado, false si no
  const { isAuthenticated } = useAuth();

  // Si el usuario YA está autenticado, redirige al dashboard
  // No tiene sentido mostrar Login o SignUp si el usuario ya está logueado
  // replace: true reemplaza la entrada del historial para evitar problemas de navegación
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si el usuario NO está autenticado, permite el acceso y renderiza el componente hijo
  // children es el componente que estaba envuelto (ej: <LoginPage />)
  return children;
};

export default PublicRoute;


