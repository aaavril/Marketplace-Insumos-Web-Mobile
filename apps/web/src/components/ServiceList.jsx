import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@core-logic/context/GlobalStateContext';
import './ServiceList.css';

/**
 * ServiceList - Componente que muestra la lista de servicios publicados
 * Filtra servicios por status === 'Publicado' para que Proveedores de Servicio puedan verlos
 */
const ServiceList = () => {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Categorías disponibles
  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'piscinas', label: 'Piscinas' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'construccion', label: 'Construcción' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'otros', label: 'Otros' }
  ];

  // Filtrar servicios publicados (F2.HU3: status === 'Publicado')
  const publishedServices = state.services.filter(service => {
    if (service.status !== 'Publicado') return false;

    // Filtro por categoría
    const matchesCategory = !categoryFilter || service.category === categoryFilter;

    // Filtro por ubicación
    const matchesLocation = !locationFilter || 
      (service.location && service.location.toLowerCase().includes(locationFilter.toLowerCase()));

    // Filtro por fecha
    const matchesDate = !dateFilter || service.date === dateFilter;

    // Búsqueda por texto (título o descripción)
    const matchesSearch = !searchQuery || 
      (service.title && service.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesLocation && matchesDate && matchesSearch;
  });

  /**
   * Obtiene el nombre del solicitante por su ID
   */
  const getSolicitanteName = (solicitanteId) => {
    const solicitante = state.users.find(user => user.id === solicitanteId);
    return solicitante ? solicitante.name : 'Usuario desconocido';
  };

  if (publishedServices.length === 0) {
    return (
      <div className="service-list-container">
        <div className="empty-services">
          <div className="empty-icon">📋</div>
          <h3>No hay servicios publicados</h3>
          <p>Actualmente no hay servicios disponibles para cotizar.</p>
        </div>
      </div>
    );
  }

  // Función para obtener el label de la categoría
  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue || 'Sin categoría';
  };

  return (
    <div className="service-list-container">
      {/* Panel de filtros avanzados y búsqueda */}
      <div className="advanced-filters-panel" style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        <div className="filter-group">
          <label htmlFor="search-input-list" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            🔍 Búsqueda
          </label>
          <input
            id="search-input-list"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o descripción..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter-list" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            📂 Categoría
          </label>
          <select
            id="category-filter-list"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#fff'
            }}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="location-filter-list" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            📍 Ubicación
          </label>
          <input
            id="location-filter-list"
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filtrar por ubicación..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="date-filter-list" style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
            📅 Fecha
          </label>
          <input
            id="date-filter-list"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        {(searchQuery || categoryFilter || locationFilter || dateFilter) && (
          <div className="filter-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('');
                setLocationFilter('');
                setDateFilter('');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className="services-grid">
        {publishedServices.map(service => (
          <div key={service.id} className="service-list-card">
            <div className="service-card-header">
              <h3 className="service-title">{service.title}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {service.category && (
                  <span style={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getCategoryLabel(service.category)}
                  </span>
                )}
                <span className="service-status-badge published">
                  {service.status}
                </span>
              </div>
            </div>

            <p className="service-description">{service.description}</p>

            <div className="service-details">
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{service.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-text">{service.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👤</span>
                <span className="detail-text">
                  {getSolicitanteName(service.solicitanteId)}
                </span>
              </div>
            </div>

            {/* Mostrar insumos requeridos si existen */}
            {service.requiredSupplies && service.requiredSupplies.length > 0 && (
              <div className="supplies-section">
                <h4 className="supplies-title">Insumos Requeridos:</h4>
                <div className="supplies-list">
                  {service.requiredSupplies.map((supply, index) => (
                    <div key={index} className="supply-tag">
                      {supply.name}
                      {supply.quantity && ` (${supply.quantity}`}
                      {supply.quantity && supply.unit && ` ${supply.unit})`}
                      {supply.quantity && !supply.unit && ')'}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="service-card-footer">
              <div className="quotes-info">
                <span className="quotes-count">
                  {service.quotes?.length || 0} cotizaciones
                </span>
              </div>
              <button
                onClick={() => navigate(`/services/${service.id}`)}
                className="btn-quote"
              >
                Ver detalle y cotizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;

