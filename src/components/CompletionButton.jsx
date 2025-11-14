import { useState } from 'react';
import { useAppState } from '../context/GlobalStateContext';
import './CompletionButton.css';

const ratingOptions = [
  { value: '', label: 'Sin valoración' },
  { value: '5', label: '⭐⭐⭐⭐⭐ (Excelente)' },
  { value: '4', label: '⭐⭐⭐⭐ (Muy bueno)' },
  { value: '3', label: '⭐⭐⭐ (Bueno)' },
  { value: '2', label: '⭐⭐ (Regular)' },
  { value: '1', label: '⭐ (Deficiente)' },
];

const CompletionButton = ({ serviceId, onCompleted }) => {
  const { dispatch } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      dispatch({
        type: 'MARK_AS_COMPLETED',
        payload: {
          serviceId,
          rating: rating ? Number(rating) : null,
        },
      });

      setSuccess(true);
      setShowForm(false);
      setRating('');

      if (typeof onCompleted === 'function') {
        onCompleted();
      }
    } catch (err) {
      setError('No pudimos completar la acción. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="completion-card">
      {!showForm ? (
        <button
          type="button"
          className="btn-complete-service"
          onClick={() => setShowForm(true)}
        >
          Marcar servicio como completado
        </button>
      ) : (
        <form className="completion-form" onSubmit={handleSubmit}>
          <label htmlFor="completion-rating" className="completion-label">
            ¿Cómo calificarías al proveedor?
          </label>
          <select
            id="completion-rating"
            className="completion-select"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            disabled={loading}
          >
            {ratingOptions.map((option) => (
              <option key={option.value || 'no-rating'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="completion-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowForm(false);
                setRating('');
                setError('');
              }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>

          {error && <div className="completion-error">{error}</div>}
        </form>
      )}

      {success && (
        <div className="completion-success">
          ¡Servicio marcado como completado!
        </div>
      )}
    </div>
  );
};

export default CompletionButton;


