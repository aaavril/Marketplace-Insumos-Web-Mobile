/**
 * SignUpPage.jsx - PÁGINA DE REGISTRO
 * 
 * Esta es la página completa que se muestra cuando el usuario visita /signup.
 * Envuelve el componente SignUp (que contiene la lógica del formulario) con
 * el layout y estilos de la página.
 * 
 * Ruta: /signup (definida en AppRouter.jsx)
 * Protección: PublicRoute (solo visible si NO estás autenticado)
 * 
 * Diferencias entre Page y Component:
 * - Page (SignUpPage): Layout completo, se renderiza en una ruta (/signup)
 * - Component (SignUp): Solo el formulario, puede reutilizarse en otras páginas
 * 
 * Funcionalidad:
 * Permite a nuevos usuarios registrarse en la plataforma eligiendo un rol:
 * - Solicitante
 * - Proveedor de Servicio
 * - Proveedor de Insumos
 */

// Componente SignUp: Contiene el formulario de registro
import SignUp from '../components/SignUp';

// Estilos específicos de la página SignUp
import './SignUpPage.css';

/**
 * SignUpPage - Página completa de registro
 * 
 * @returns {JSX.Element} Renderiza el componente SignUp dentro del layout de página
 * 
 * Esta página:
 * 1. Se renderiza cuando el usuario visita /signup
 * 2. Muestra el componente SignUp que contiene el formulario de registro
 * 3. Si el usuario ya está autenticado, PublicRoute lo redirige a /dashboard
 * 4. Después de un registro exitoso, el usuario puede iniciar sesión
 */
const SignUpPage = () => {
  // Renderiza el componente SignUp (formulario de registro)
  return <SignUp />;
};

export default SignUpPage;

