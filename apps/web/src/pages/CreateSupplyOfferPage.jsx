/**
 * CreateSupplyOfferPage.jsx - PÁGINA PARA CREAR UNA OFERTA DE INSUMOS
 * 
 * Esta página permite a los usuarios con rol "Proveedor de Insumos" publicar
 * un nuevo pack de insumos en el marketplace.
 * 
 * Ruta: /supplies/create (definida en AppRouter.jsx)
 * Protección: ProtectedRoute (solo visible si estás autenticado)
 * Rol requerido: Proveedor de Insumos (aunque no se valida explícitamente aquí,
 * la funcionalidad está pensada para este rol)
 * 
 * Características:
 * - Header con botón para volver al dashboard
 * - Formulario completo para crear un pack de insumos (SupplyOfferForm)
 * - El formulario permite agregar título, descripción, precio total e items individuales
 * - Cada item puede tener nombre, cantidad y unidad de medida
 */

// useNavigate: Hook de React Router para navegar programáticamente a otras rutas
import { useNavigate } from 'react-router-dom';

// SupplyOfferForm: Componente que contiene el formulario completo para crear una oferta de insumos
import SupplyOfferForm from '../components/SupplyOfferForm';

// Estilos específicos de la página CreateSupplyOffer
import './CreateSupplyOfferPage.css';

/**
 * CreateSupplyOfferPage - Página para crear una nueva oferta de insumos
 * 
 * @returns {JSX.Element} Layout completo con header y formulario de oferta de insumos
 * 
 * Esta página:
 * 1. Muestra un header con título y descripción
 * 2. Incluye un botón para volver al dashboard
 * 3. Renderiza el componente SupplyOfferForm que contiene todo el formulario de creación
 * 4. Después de crear la oferta exitosamente, el usuario es redirigido automáticamente
 */
const CreateSupplyOfferPage = () => {
  // Hook para navegar programáticamente a otras rutas
  const navigate = useNavigate();

  /**
   * Maneja el click en el botón "Volver al Dashboard"
   * Redirige al usuario de vuelta a su dashboard principal
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="create-supply-page">
      {/* Header de la página con navegación y título */}
      <div className="page-header">
        <div className="header-top">
          {/* Botón para volver al dashboard */}
          <button onClick={handleBack} className="btn-back">
            ← Volver al Dashboard
          </button>
          
          {/* Brand: Logo de la aplicación */}
          <div className="page-brand">
            <span className="brand-name">MARKET DEL ESTE</span>
          </div>
        </div>
        
        {/* Contenido del header: Título y descripción */}
        <div className="header-content">
          <h1>Crear Nuevo Pack de Insumos</h1>
          <p className="page-description">
            Publica tus packs y describe claramente los insumos incluidos y su precio total.
          </p>
        </div>
      </div>

      {/* 
        Wrapper del formulario con estilos específicos
        SupplyOfferForm: Componente que contiene todo el formulario de creación
        - Campos: título, descripción, precio total
        - Lista de items: nombre, cantidad, unidad (dinámicamente agregables)
        - Validaciones: Campos obligatorios, precio válido, al menos un item requerido
        - Al enviar: Crea la oferta y la agrega al estado global
      */}
      <div className="form-wrapper">
        <SupplyOfferForm />
      </div>
    </div>
  );
};

export default CreateSupplyOfferPage;

