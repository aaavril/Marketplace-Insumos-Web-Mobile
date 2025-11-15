import { useNavigate } from 'react-router-dom';
import SupplyOfferForm from '../components/SupplyOfferForm';
import './CreateSupplyOfferPage.css';

const CreateSupplyOfferPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-supply-page">
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
          <h1>Crear Nuevo Pack de Insumos</h1>
          <p className="page-description">
            Publica tus packs y describe claramente los insumos incluidos y su precio total.
          </p>
        </div>
      </div>

      <div className="form-wrapper">
        <SupplyOfferForm />
      </div>
    </div>
  );
};

export default CreateSupplyOfferPage;

