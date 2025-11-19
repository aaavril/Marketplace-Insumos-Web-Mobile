/**
 * ServicesListPage.jsx - PÁGINA DE LISTADO DE SERVICIOS
 * 
 * Esta página muestra todos los servicios publicados que están disponibles
 * para que los Proveedores de Servicio puedan cotizar.
 * 
 * Ruta: /services (definida en AppRouter.jsx)
 * Protección: ProtectedRoute (solo visible si estás autenticado)
 * Rol principal: Proveedor de Servicio (aunque cualquier usuario autenticado puede verla)
 * 
 * Características:
 * - Lista todos los servicios con estado "Publicado"
 * - Filtros avanzados: categoría, ubicación, fecha, búsqueda por texto
 * - Muestra información resumida de cada servicio
 * - Permite navegar al detalle de cada servicio para cotizar
 * 
 * Flujo:
 * Proveedor de Servicio → Ve servicios publicados → Hace clic en uno → 
 * ServiceDetailPage → Completa cotización → Envía
 */

// useNavigate: Hook de React Router para navegar programáticamente
import { useNavigate } from 'react-router-dom';

// useAuth: Hook para acceder a información de autenticación (aunque no se usa actualmente)
import { useAuth } from '@core-logic/context/AuthContext';

// ServiceList: Componente que muestra la lista de servicios con filtros
import ServiceList from '../components/ServiceList';

// Estilos específicos de la página ServicesList
import './ServicesListPage.css';

/**
 * ServicesListPage - Página que muestra la lista de servicios publicados
 * Para Proveedores de Servicio
 * 
 * @returns {JSX.Element} Layout completo con header y listado de servicios
 * 
 * Esta página:
 * 1. Muestra un header con título y descripción
 * 2. Incluye un botón para volver al dashboard
 * 3. Renderiza el componente ServiceList que contiene:
 *    - Filtros avanzados (categoría, ubicación, fecha, búsqueda)
 *    - Grid de tarjetas con servicios publicados
 *    - Cada tarjeta muestra título, descripción, ubicación, fecha, solicitante
 *    - Botón para ver detalle y cotizar
 */
const ServicesListPage = () => {
  // Hook para navegar programáticamente
  const navigate = useNavigate();
  
  // Hook para obtener información de autenticación (actualmente no se usa, pero disponible)
  const { getUserRole } = useAuth();

  /**
   * Maneja el click en el botón "Volver al Dashboard"
   * Redirige al usuario de vuelta a su dashboard principal
   */
  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="services-list-page">
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
          <h1>Servicios Publicados</h1>
          <p className="page-subtitle">
            Explora los servicios disponibles en Punta del Este y decide cuál cotizar
          </p>
        </div>
      </div>
      
      {/* 
        ServiceList: Componente que muestra la lista completa de servicios
        - Filtra automáticamente servicios con estado "Publicado"
        - Incluye filtros: categoría, ubicación, fecha, búsqueda por texto
        - Cada servicio es clickeable y navega a ServiceDetailPage
        - Muestra información resumida: título, descripción, ubicación, fecha, solicitante
      */}
      <ServiceList />
    </div>
  );
};

export default ServicesListPage;

