import { useNavigate } from 'react-router-dom';
import { useAuth } from '@core-logic/context/AuthContext';
import ServiceList from '../components/ServiceList';
import './ServicesListPage.css';

/**
 * ServicesListPage - Página que muestra la lista de servicios publicados
 * Para Proveedores de Servicio
 */
const ServicesListPage = () => {
  const navigate = useNavigate();
  const { getUserRole } = useAuth();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="services-list-page">
      <div className="page-header">
        <div className="header-top">
          <button onClick={handleBack} className="btn-back">
            ← Volver al Dashboard
          </button>
          <div className="page-brand">
            <span className="brand-name">MARKET DEL ESTE</span>
          </div>
        </div>
        <div className="header-content">
          <h1>Servicios Publicados</h1>
          <p className="page-subtitle">
            Explora los servicios disponibles en Punta del Este y decide cuál cotizar
          </p>
        </div>
      </div>
      <ServiceList />
    </div>
  );
};

export default ServicesListPage;

