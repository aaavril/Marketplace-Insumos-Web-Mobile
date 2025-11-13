import { useState } from 'react';
import { useAppState } from '../context/GlobalStateContext';
import { useAuth } from '../context/AuthContext';
import './QuoteForm.css';

/**
 * QuoteForm - Formulario para que un Proveedor de Servicio envíe una cotización
 * F3.HU1: Permite ingresar precio total, plazo y notas.
 */
const QuoteForm = ({ serviceId }) => {
  const { dispatch } = useAppState();
  const { user } = useAuth();

  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return null;
  }

  const resetForm = () => {
    setPrice('');
    setDeadline('');
    setNotes('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const priceValue = parseFloat(price);

      if (Number.isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Ingresa un precio válido mayor a cero');
      }

      if (!deadline) {
        throw new Error('Selecciona un plazo estimado');
      }

      const newQuote = {
        id: Date.now().toString(),
        serviceId,
        serviceProviderId: user.id,
        price: priceValue,
        deadline,
        notes,
        createdAt: new Date().toISOString()
      };

      dispatch({ type: 'ADD_QUOTE', payload: { serviceId, quote: newQuote } });

      setSuccess(true);
      resetForm();
    } catch (err) {
      setError(err.message || 'Error al enviar la cotización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-form-card">
      <h3>Enviar Cotización</h3>
      <p className="quote-form-subtitle">
        Completa los datos para cotizar este servicio en Market del Este
      </p>

      {success && (
        <div className="quote-success">
          Cotización enviada correctamente. El solicitante revisará tu propuesta.
        </div>
      )}

      {error && (
        <div className="quote-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="quote-form">
        <div className="form-group">
          <label htmlFor="quote-price">Precio total estimado (USD)</label>
          <input
            id="quote-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: 1500"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quote-deadline">Plazo estimado</label>
          <input
            id="quote-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            disabled={loading}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quote-notes">Notas adicionales</label>
          <textarea
            id="quote-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe detalles importantes: materiales, tiempos, condiciones..."
            rows={4}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn-submit-quote"
          disabled={loading}
        >
          {loading ? 'Enviando cotización...' : 'Enviar cotización'}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;

