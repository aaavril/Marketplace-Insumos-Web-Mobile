/**
 * Helper functions para el dashboard
 */

/**
 * Obtiene el label de rating con estrellas
 * @param {number|null} rating - Rating del servicio
 * @returns {string|null} - Label formateado con estrellas
 */
export const getRatingLabel = (rating) => {
  if (rating == null) return null;
  const labels = {
    5: '⭐⭐⭐⭐⭐ Excelente',
    4: '⭐⭐⭐⭐ Muy bueno',
    3: '⭐⭐⭐ Bueno',
    2: '⭐⭐ Regular',
    1: '⭐ Deficiente',
  };
  return labels[rating] || `${rating}/5`;
};

/**
 * Obtiene el nombre del proveedor por su ID
 * @param {Array} users - Array de usuarios
 * @param {string} providerId - ID del proveedor
 * @returns {string} - Nombre del proveedor
 */
export const getProviderName = (users, providerId) => {
  const provider = users.find((user) => user.id === providerId);
  return provider ? provider.name : 'Proveedor';
};

/**
 * Obtiene el nombre del proveedor asignado a un servicio
 * @param {Object} service - Servicio
 * @param {Array} users - Array de usuarios
 * @returns {string|null} - Nombre del proveedor asignado o null
 */
export const getAssignedProviderName = (service, users) => {
  if (!service.selectedQuoteId) return null;
  const selectedQuote = service.quotes?.find(
    (quote) => quote.id === service.selectedQuoteId
  );
  return selectedQuote ? getProviderName(users, selectedQuote.serviceProviderId) : null;
};

