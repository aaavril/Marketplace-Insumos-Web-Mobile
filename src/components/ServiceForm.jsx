import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/GlobalStateContext';
import './ServiceForm.css';

/**
 * ServiceForm - Formulario para publicar un nuevo servicio
 * Permite a los Solicitantes crear solicitudes de servicio
 */
const ServiceForm = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  
  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Crear el nuevo servicio según el Modelo de Datos MVP
      const newService = {
        id: Date.now().toString(), // ID único simple
        title,
        description,
        location,
        date,
        status: 'Publicado', // Estado inicial (Regla de Negocio)
        requiredSupplies: [], // Se implementará en F2.HU2
        quotes: [],
        supplyOffers: [],
        solicitanteId: state.currentUser.id // Vinculación con el creador
      };

      // Despachar la acción para agregar el servicio
      dispatch({ type: 'ADD_SERVICE', payload: newService });

      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setLocation('');
      setDate('');

      // Mostrar mensaje de éxito y navegar al dashboard
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Error al publicar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form-container">
      <div className="service-form-card">
        <h2>Publicar Nueva Solicitud de Servicio</h2>
        
        {success && (
          <div className="success-message">
            Servicio publicado exitosamente
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="title">Título del Servicio *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Necesito reparación de techo"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente el servicio que necesitas..."
              rows="5"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación *</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Montevideo, Centro"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Fecha Deseada *</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar Servicio'}
          </button>
        </form>
      </div>

      {/* Listado simple de servicios publicados por el solicitante */}
      {state.services.filter(s => s.solicitanteId === state.currentUser.id).length > 0 && (
        <div className="my-services-section">
          <h3>Mis Servicios Publicados</h3>
          <div className="services-list">
            {state.services
              .filter(s => s.solicitanteId === state.currentUser.id)
              .map(service => (
                <div key={service.id} className="service-card">
                  <h4>{service.title}</h4>
                  <p>{service.description}</p>
                  <div className="service-meta">
                    <span>📍 {service.location}</span>
                    <span>📅 {service.date}</span>
                    <span className={`status-badge ${service.status.toLowerCase()}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceForm;

