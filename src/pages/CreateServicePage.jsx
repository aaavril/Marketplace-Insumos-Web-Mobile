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
        <button onClick={handleBack} className="btn-back">
          ← Volver al Dashboard
        </button>
        <h1>Crear Nueva Solicitud de Servicio</h1>
      </div>
      <ServiceForm />
    </div>
  );
};

export default CreateServicePage;


