import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@core-logic/context/GlobalStateContext';
import './ServiceForm.css';

/**
 * ServiceForm - Formulario para publicar un nuevo servicio
 * Permite a los Solicitantes crear solicitudes de servicio
 * F2.HU2: Incluye lista dinámica de insumos requeridos
 */
const ServiceForm = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  
  // Estructura de un insumo (Supply)
  const createEmptySupply = () => ({
    id: Date.now() + Math.random(), // ID único
    name: '',
    quantity: '',
    unit: ''
  });
  
  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [requiredSupplies, setRequiredSupplies] = useState([createEmptySupply()]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Categorías disponibles
  const categories = [
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'piscinas', label: 'Piscinas' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'construccion', label: 'Construcción' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'otros', label: 'Otros' }
  ];

  /**
   * Agrega un nuevo insumo vacío a la lista
   */
  const handleAddSupply = () => {
    setRequiredSupplies([...requiredSupplies, createEmptySupply()]);
  };

  /**
   * Elimina un insumo de la lista por su ID
   * @param {string|number} id - ID del insumo a eliminar
   */
  const handleRemoveSupply = (id) => {
    // No permitir eliminar si solo hay un insumo
    if (requiredSupplies.length > 1) {
      setRequiredSupplies(requiredSupplies.filter(supply => supply.id !== id));
    }
  };

  /**
   * Actualiza un campo específico de un insumo
   * @param {string|number} id - ID del insumo a actualizar
   * @param {string} field - Campo a actualizar ('name', 'quantity', o 'unit')
   * @param {string} value - Nuevo valor del campo
   */
  const handleSupplyChange = (id, field, value) => {
    setRequiredSupplies(
      requiredSupplies.map(supply =>
        supply.id === id ? { ...supply, [field]: value } : supply
      )
    );
  };

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
        category: category || 'otros', // Categoría del servicio
        location,
        date,
        status: 'Publicado', // Estado inicial (Regla de Negocio)
        requiredSupplies: requiredSupplies.filter(s => s.name.trim() !== ''), // F2.HU2: Filtrar insumos vacíos
        quotes: [],
        supplyOffers: [],
      selectedQuoteId: null,
      rating: null,
        solicitanteId: state.currentUser.id // Vinculación con el creador
      };

      // Despachar la acción para agregar el servicio
      dispatch({ type: 'ADD_SERVICE', payload: newService });

      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation('');
      setDate('');
      setRequiredSupplies([createEmptySupply()]);

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
        <div className="form-header">
          <h2>Publicar Nueva Solicitud de Servicio</h2>
          <p className="form-subtitle">En MARKET DEL ESTE, conectamos tu necesidad con los mejores proveedores</p>
        </div>
        
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
            <label htmlFor="category">Categoría *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
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

          {/* F2.HU2: Lista dinámica de insumos requeridos */}
          <div className="form-group supplies-section">
            <div className="supplies-header">
              <label>Insumos Requeridos</label>
              <button
                type="button"
                onClick={handleAddSupply}
                className="btn-add-supply"
                disabled={loading}
              >
                + Agregar Insumo
              </button>
            </div>
            
            <div className="supplies-list">
              {requiredSupplies.map((supply, index) => (
                <div key={supply.id} className="supply-item">
                  <div className="supply-inputs">
                    <div className="supply-field supply-name">
                      <label htmlFor={`supply-name-${supply.id}`}>
                        Nombre del Insumo
                      </label>
                      <input
                        id={`supply-name-${supply.id}`}
                        type="text"
                        value={supply.name}
                        onChange={(e) => handleSupplyChange(supply.id, 'name', e.target.value)}
                        placeholder="Ej: Cemento, Pintura, etc."
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="supply-field supply-quantity">
                      <label htmlFor={`supply-quantity-${supply.id}`}>
                        Cantidad
                      </label>
                      <input
                        id={`supply-quantity-${supply.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={supply.quantity}
                        onChange={(e) => handleSupplyChange(supply.id, 'quantity', e.target.value)}
                        placeholder="0"
                        disabled={loading}
                      />
                    </div>
                    
                    <div className="supply-field supply-unit">
                      <label htmlFor={`supply-unit-${supply.id}`}>
                        Unidad
                      </label>
                      <input
                        id={`supply-unit-${supply.id}`}
                        type="text"
                        value={supply.unit}
                        onChange={(e) => handleSupplyChange(supply.id, 'unit', e.target.value)}
                        placeholder="kg, litros, unidades..."
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {requiredSupplies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSupply(supply.id)}
                      className="btn-remove-supply"
                      disabled={loading}
                      aria-label="Eliminar insumo"
                    >
                      ✕ Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="supplies-hint">
              Agrega los insumos que necesitas para realizar el servicio. Los campos vacíos no se guardarán.
            </p>
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

    </div>
  );
};

export default ServiceForm;

