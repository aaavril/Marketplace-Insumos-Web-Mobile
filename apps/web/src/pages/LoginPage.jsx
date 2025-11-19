/**
 * LoginPage.jsx - PÁGINA DE AUTENTICACIÓN
 * 
 * Esta es la página completa que se muestra cuando el usuario visita /login.
 * Envuelve el componente Login (que contiene la lógica del formulario) con
 * el layout y estilos de la página.
 * 
 * Diferencias entre Page y Component:
 * - Page (LoginPage): Layout completo, se renderiza en una ruta (/login)
 * - Component (Login): Solo el formulario, puede reutilizarse en otras páginas
 * 
 * Ruta: /login (definida en AppRouter.jsx)
 * Protección: PublicRoute (solo visible si NO estás autenticado)
 */

// Componente Login: Contiene el formulario de autenticación
import Login from '../components/Login';

// Estilos específicos de la página Login
import './LoginPage.css';

/**
 * LoginPage - Página completa de autenticación
 * 
 * @returns {JSX.Element} Renderiza el componente Login dentro del layout de página
 * 
 * Esta página:
 * 1. Se renderiza cuando el usuario visita /login
 * 2. Muestra el componente Login que contiene el formulario de autenticación
 * 3. Si el usuario ya está autenticado, PublicRoute lo redirige a /dashboard
 * 4. Después de un login exitoso, el usuario es redirigido a /dashboard
 */
const LoginPage = () => {
  // Renderiza el componente Login (formulario de autenticación)
  return <Login />;
};

export default LoginPage;

