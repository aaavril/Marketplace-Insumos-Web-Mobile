import { useState } from 'react';
import { useAppState } from '@core-logic/context/GlobalStateContext';
import { useAuth } from '@core-logic/context/AuthContext';
import './SupplyOfferForm.css';

/**
 * SupplyOfferForm - Formulario para publicar una oferta de pack de insumos
 * Permite a los proveedores de insumos publicar ofertas con items y precio total
 */
const SupplyOfferForm = () => {
  const { dispatch } = useAppState();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [items, setItems] = useState([
    { id: Date.now(), name: '', quantity: '', unit: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.role !== 'Proveedor de Insumos') {
    return null;
  }

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now() + Math.random(), name: '', quantity: '', unit: '' }
    ]);
  };

  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTotalPrice('');
    setItems([{ id: Date.now(), name: '', quantity: '', unit: '' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const priceValue = parseFloat(totalPrice);

      if (!title.trim()) {
        throw new Error('Ingresa un nombre para tu pack de insumos');
      }

      if (Number.isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Ingresa un precio total válido mayor a cero');
      }

      const parsedItems = items
        .filter((item) => item.name.trim() !== '')
        .map((item) => ({
          name: item.name.trim(),
          quantity: item.quantity,
          unit: item.unit
        }));

      if (parsedItems.length === 0) {
        throw new Error('Agrega al menos un insumo al pack');
      }

      const offer = {
        id: Date.now().toString(),
        providerId: user.id,
        providerName: user.name,
        title: title.trim(),
        description: description.trim(),
        totalPrice: priceValue,
        items: parsedItems,
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_SUPPLY_OFFER', payload: offer });

      setSuccess(true);
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al publicar la oferta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supply-offer-card">
      <h3>Publicar Pack de Insumos</h3>
      <p className="offer-subtitle">
        Crea una oferta de insumos para que los solicitantes la consideren en sus servicios.
      </p>

      {success && (
        <div className="offer-success">
          Oferta publicada exitosamente. Los solicitantes podrán verla en su panel.
        </div>
      )}

      {error && <div className="offer-error">{error}</div>}

      <form onSubmit={handleSubmit} className="offer-form">
        <div className="form-group">
          <label htmlFor="offer-title">Nombre del pack</label>
          <input
            id="offer-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Pack Obra Gruesa"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="offer-description">Descripción</label>
          <textarea
            id="offer-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe qué incluye este pack y sus beneficios..."
            rows={4}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="offer-price">Precio total (USD)</label>
          <input
            id="offer-price"
            type="number"
            min="0"
            step="0.01"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            placeholder="Ej: 850"
            disabled={loading}
            required
          />
        </div>

        <div className="items-header">
          <h4>Insumos incluidos</h4>
          <button type="button" onClick={addItem} className="btn-add-item" disabled={loading}>
            + Agregar insumo
          </button>
        </div>

        <div className="items-list">
          {items.map((item, index) => (
            <div key={item.id} className="item-row">
              <div className="item-field">
                <label htmlFor={`item-name-${item.id}`}>Nombre</label>
                <input
                  id={`item-name-${item.id}`}
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Ej: Cemento Portland"
                  disabled={loading}
                  required
                />
              </div>

              <div className="item-field">
                <label htmlFor={`item-quantity-${item.id}`}>Cantidad</label>
                <input
                  id={`item-quantity-${item.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  placeholder="Ej: 50"
                  disabled={loading}
                />
              </div>

              <div className="item-field">
                <label htmlFor={`item-unit-${item.id}`}>Unidad</label>
                <input
                  id={`item-unit-${item.id}`}
                  type="text"
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                  placeholder="Ej: bolsas"
                  disabled={loading}
                />
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => removeItem(item.id)}
                  disabled={loading}
                  aria-label={`Eliminar insumo ${index + 1}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="btn-submit-offer" disabled={loading}>
          {loading ? 'Publicando oferta...' : 'Publicar oferta'}
        </button>
      </form>
    </div>
  );
};

export default SupplyOfferForm;

