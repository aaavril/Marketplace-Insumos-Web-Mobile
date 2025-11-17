import { useNavigate } from 'react-router-dom';
import ServiceForm from '../components/ServiceForm';
import './CreateServicePage.css';

/**
 * CreateServicePage - Página para crear una nueva solicitud de servicio
 */
const CreateServicePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-service-page">
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
          <h1>Crear Nueva Solicitud de Servicio</h1>
          <p className="page-description">
            Publica tu necesidad de servicio o insumos en Punta del Este
          </p>
        </div>
      </div>
      <ServiceForm />
    </div>
  );
};

export default CreateServicePage;


