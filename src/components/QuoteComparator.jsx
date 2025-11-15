import { useMemo, useState } from 'react';
import './QuoteComparator.css';

/**
 * QuoteComparator
 * Permite comparar cotizaciones recibidas por un servicio
 * Ordena por precio ascendente para facilitar la evaluación
 */
const QuoteComparator = ({
  quotes = [],
  getProviderName,
  users = [],
  onClose,
  selectedQuoteId,
  completedRatingLabel = null,
  serviceStatus = '',
}) => {
  const [sortOption, setSortOption] = useState('price');

  const getProviderProfile = (providerId) =>
    users.find((user) => user.id === providerId);

  const getDurationValue = (quote) => {
    if (typeof quote.duration === 'number' && !Number.isNaN(quote.duration)) {
      return quote.duration;
    }
    return Number.POSITIVE_INFINITY;
  };

  const sortedQuotes = useMemo(() => {
    const list = [...quotes];

    if (sortOption === 'duration') {
      return list.sort((a, b) => getDurationValue(a) - getDurationValue(b));
    }

    return list.sort((a, b) => a.price - b.price);
  }, [quotes, sortOption]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="quote-comparator">
      <div className="comparator-header">
        <div>
          <h3>Comparador de Cotizaciones</h3>
          <p className="comparator-subtitle">
            Analiza cada propuesta y selecciona la que mejor se adapte a tu proyecto.
          </p>
        </div>
        <div className="comparator-actions">
          <label className="sort-label" htmlFor="quote-sort">
            Ordenar por
          </label>
          <select
            id="quote-sort"
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="price">Menor precio</option>
            <option value="duration">Menor duración</option>
          </select>
          <button type="button" className="btn-close-comparator" onClick={onClose}>
            Cerrar ✕
          </button>
        </div>
      </div>

      <div className="comparator-helper">
        {sortOption === 'price'
          ? 'Ordenadas de menor a mayor precio total.'
          : 'Ordenadas por menor duración estimada (días).'}
      </div>

      {sortedQuotes.length > 0 ? (
        <div className="comparator-table-wrapper">
          <table className="comparator-table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Rating</th>
                <th>Precio (USD)</th>
                <th>Duración (días)</th>
                <th>Plazo estimado</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Fecha de envío</th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotes.map((quote) => {
                const isSelected = selectedQuoteId === quote.id;
                const providerProfile = getProviderProfile(quote.serviceProviderId);
                const providerHasRatings =
                  providerProfile && (providerProfile.ratingCount ?? 0) > 0;
                const providerRatingLabel = providerHasRatings
                  ? `⭐ ${Number(providerProfile.averageRating || 0).toFixed(1)}/5`
                  : 'Sin valoraciones';

                let stateLabel = 'Disponible';
                if (isSelected) {
                  if (serviceStatus === 'Completado') {
                    stateLabel = completedRatingLabel
                      ? `Completado · ${completedRatingLabel}`
                      : 'Completado';
                  } else if (serviceStatus === 'Asignado') {
                    stateLabel = 'Asignada';
                  } else if (serviceStatus === 'En Evaluación') {
                    stateLabel = 'En evaluación';
                  } else {
                    stateLabel = 'Seleccionada';
                  }
                }

                return (
                  <tr
                    key={quote.id}
                    className={isSelected ? 'selected' : undefined}
                  >
                    <td>{getProviderName(quote.serviceProviderId)}</td>
                    <td className="rating-cell">
                      {providerRatingLabel}
                      {providerHasRatings && (
                        <span className="rating-count">
                          ({providerProfile.ratingCount})
                        </span>
                      )}
                    </td>
                    <td>{quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}</td>
                    <td>
                      {quote.duration
                        ? `${quote.duration}`
                        : '—'}
                    </td>
                    <td>{quote.deadline || '—'}</td>
                    <td>{stateLabel}</td>
                    <td>{quote.notes || '—'}</td>
                    <td>
                      {quote.createdAt
                        ? new Date(quote.createdAt).toLocaleDateString('es-UY')
                        : 'Sin fecha'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="comparator-empty">
          <p>Todavía no hay cotizaciones para comparar.</p>
        </div>
      )}
    </div>
  );
};

export default QuoteComparator;


