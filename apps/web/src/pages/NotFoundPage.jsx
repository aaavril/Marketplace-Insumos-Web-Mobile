import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

/**
 * NotFoundPage - Página 404
 * Se muestra cuando el usuario intenta acceder a una ruta que no existe
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Página no encontrada</h2>
          <p className="not-found-message">
            Lo sentimos, la página que estás buscando no existe.
          </p>
          <button onClick={handleGoHome} className="btn-go-home">
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;


