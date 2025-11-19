/**
 * CreateServicePage.jsx - PÁGINA PARA CREAR UN NUEVO SERVICIO
 * 
 * Esta página permite a los usuarios con rol "Solicitante" publicar una nueva
 * solicitud de servicio o necesidad de insumos en el marketplace.
 * 
 * Ruta: /services/create (definida en AppRouter.jsx)
 * Protección: ProtectedRoute (solo visible si estás autenticado)
 * Rol requerido: Solicitante (aunque no se valida explícitamente aquí, 
 * la funcionalidad está pensada para este rol)
 * 
 * Características:
 * - Header con botón para volver al dashboard
 * - Formulario completo para crear un servicio (ServiceForm)
 * - El formulario permite agregar título, descripción, ubicación, fecha, categoría e insumos requeridos
 */

// useNavigate: Hook de React Router para navegar programáticamente a otras rutas
import { useNavigate } from 'react-router-dom';

// ServiceForm: Componente que contiene el formulario completo para crear un servicio
import ServiceForm from '../components/ServiceForm';

// Estilos específicos de la página CreateService
import './CreateServicePage.css';

/**
 * CreateServicePage - Página para crear una nueva solicitud de servicio
 * 
 * @returns {JSX.Element} Layout completo con header y formulario de servicio
 * 
 * Esta página:
 * 1. Muestra un header con título y descripción
 * 2. Incluye un botón para volver al dashboard
 * 3. Renderiza el componente ServiceForm que contiene todo el formulario de creación
 * 4. Después de crear el servicio exitosamente, el usuario es redirigido automáticamente
 */
const CreateServicePage = () => {
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
    <div className="create-service-page">
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
          <h1>Crear Nueva Solicitud de Servicio</h1>
          <p className="page-description">
            Publica tu necesidad de servicio o insumos en Punta del Este
          </p>
        </div>
      </div>
      
      {/* 
        ServiceForm: Componente que contiene todo el formulario de creación
        - Campos: título, descripción, ubicación, fecha, categoría
        - Opcional: Lista de insumos requeridos
        - Validaciones: Campos obligatorios, formatos, etc.
        - Al enviar: Crea el servicio y lo agrega al estado global
      */}
      <ServiceForm />
    </div>
  );
};

export default CreateServicePage;


