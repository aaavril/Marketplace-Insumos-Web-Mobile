import React, { useState, useEffect } from 'react';
import { useAppState } from '@core-logic/context/GlobalStateContext';
import { useAuth } from '@core-logic/context/AuthContext';
import './QuoteForm.css';

/**
 * QuoteForm - Formulario para que un Proveedor de Servicio envíe una cotización
 * F3.HU1: Permite ingresar precio total, plazo y notas.
 * Bloquea cotizaciones si el servicio está "Asignado" o "Completado"
 */
const QuoteForm = ({
  serviceId,
  editingQuote = null,
  onSave = null,
  onCancel = null
}) => {
  const { state, dispatch } = useAppState();
  const { user } = useAuth();

  // Obtener el servicio actual para verificar su estado
  const service = state.services.find((s) => s.id === serviceId);
  const isServiceAssigned = service?.status === 'Asignado' || service?.status === 'Completado';

  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return null;
  }

  // Bloquear cotizaciones si el servicio está asignado o completado
  if (isServiceAssigned) {
    return (
      <div className="quote-form-card" style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <h3 style={{ margin: 0, color: '#856404', fontSize: '16px', fontWeight: '600' }}>
              Cotizaciones cerradas
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#856404', fontSize: '14px' }}>
              Este servicio ya ha sido asignado a un proveedor. No se pueden agregar nuevas cotizaciones.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setPrice('');
    setDeadline('');
    setNotes('');
    setDuration('');
  };

  useEffect(() => {
    if (editingQuote) {
      setPrice(editingQuote.price?.toString() || '');
      setDeadline(editingQuote.deadline || '');
      setDuration(editingQuote.duration?.toString() || '');
      setNotes(editingQuote.notes || '');
    } else {
      resetForm();
    }
  }, [editingQuote]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Verificar que el servicio aún esté disponible para cotizar
      const currentService = state.services.find((s) => s.id === serviceId);
      if (currentService?.status === 'Asignado' || currentService?.status === 'Completado') {
        throw new Error('Este servicio ya ha sido asignado. No se pueden agregar nuevas cotizaciones.');
      }

      const priceValue = parseFloat(price);

      if (Number.isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Ingresa un precio válido mayor a cero');
      }

      if (!deadline) {
        throw new Error('Selecciona un plazo estimado');
      }

      const durationValue = parseInt(duration, 10);

      if (Number.isNaN(durationValue) || durationValue <= 0) {
        throw new Error('Ingresa una duración estimada en días (mayor a cero)');
      }

      const newQuote = {
        id: Date.now().toString(),
        serviceId,
        serviceProviderId: user.id,
        price: priceValue,
        deadline,
        duration: durationValue,
        notes,
        createdAt: new Date().toISOString()
      };

      // Si estamos editando, actualizar. Si no, crear nueva.
      if (editingQuote && onSave) {
        const updatedQuote = {
          ...editingQuote,
          price: priceValue,
          deadline,
          duration: durationValue,
          notes
        };
        onSave(updatedQuote);
      } else {
        dispatch({ type: 'ADD_QUOTE', payload: { serviceId, quote: newQuote } });
        setSuccess(true);
        resetForm();
      }
    } catch (err) {
      setError(err.message || 'Error al enviar la cotización');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-form-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3>{editingQuote ? 'Editar Cotización' : 'Enviar Cotización'}</h3>
        {editingQuote && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Cancelar
          </button>
        )}
      </div>
      <p className="quote-form-subtitle">
        {editingQuote 
          ? 'Modifica los datos de tu cotización'
          : 'Completa los datos para cotizar este servicio en MARKET DEL ESTE'}
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
          <label htmlFor="quote-duration">Duración estimada (días)</label>
          <input
            id="quote-duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ej: 5"
            required
            disabled={loading}
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
          {loading 
            ? (editingQuote ? 'Guardando cambios...' : 'Enviando cotización...')
            : (editingQuote ? 'Guardar cambios' : 'Enviar cotización')}
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;

