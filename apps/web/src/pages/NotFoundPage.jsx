/**
 * NotFoundPage.jsx - PÁGINA 404 (NO ENCONTRADA)
 * 
 * Esta página se muestra cuando el usuario intenta acceder a una URL que
 * no existe o no está definida en las rutas de la aplicación.
 * 
 * Ruta: /* (catch-all, definida en AppRouter.jsx como la última ruta)
 * Protección: Ninguna (siempre accesible)
 * 
 * ¿Cuándo se muestra?
 * - Usuario visita una URL que no coincide con ninguna ruta definida
 * - Ejemplos: /pagina-inexistente, /dashboard/error, /cualquier/cosa
 * 
 * Funcionalidad:
 * - Muestra un mensaje amigable de error 404
 * - Botón para volver a la página de inicio
 * - Diseño simple y claro para no confundir al usuario
 */

// useNavigate: Hook de React Router para navegar programáticamente
import { useNavigate } from 'react-router-dom';

// Estilos específicos de la página 404
import './NotFoundPage.css';

/**
 * NotFoundPage - Página 404 (No encontrada)
 * 
 * @returns {JSX.Element} Página de error 404 con mensaje y botón para volver al inicio
 * 
 * Esta página:
 * 1. Se muestra cuando la URL no coincide con ninguna ruta definida
 * 2. Muestra un mensaje claro indicando que la página no existe
 * 3. Proporciona un botón para volver a la página de inicio (/)
 */
const NotFoundPage = () => {
  // Hook para navegar programáticamente
  const navigate = useNavigate();

  /**
   * Maneja el click en el botón "Volver al inicio"
   * Redirige al usuario a la página principal (LandingPage)
   */
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          {/* Título principal con el código de error 404 */}
          <h1 className="not-found-title">404</h1>
          
          {/* Subtítulo explicativo */}
          <h2 className="not-found-subtitle">Página no encontrada</h2>
          
          {/* Mensaje descriptivo para el usuario */}
          <p className="not-found-message">
            Lo sentimos, la página que estás buscando no existe.
          </p>
          
          {/* Botón para volver a la página de inicio */}
          <button onClick={handleGoHome} className="btn-go-home">
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;


