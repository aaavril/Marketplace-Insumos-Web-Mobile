/**
 * AppReducer - Función de reducción para el estado global
 * Maneja todas las acciones que modifican el estado de la aplicación
 * 
 * @param {Object} state - Estado actual de la aplicación
 * @param {Object} action - Acción a ejecutar { type: string, payload: any }
 * @returns {Object} - Nuevo estado de la aplicación
 */
export const AppReducer = (state, action) => {
  switch (action.type) {
    // ==================== AUTENTICACIÓN ====================
    
    /**
     * SET_CURRENT_USER - Establece el usuario autenticado
     * payload: Object - Usuario completo con todos sus datos (incluye role)
     */
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      };

    /**
     * LOGOUT - Cierra la sesión del usuario actual
     * payload: ninguno
     */
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null
      };

    // ==================== USUARIOS ====================
    
    /**
     * ADD_USER - Agrega un nuevo usuario al estado
     * payload: Object - Objeto User completo con todos sus campos
     */
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };

    // ==================== SERVICIOS ====================
    
    /**
     * ADD_SERVICE - Agrega un nuevo servicio al estado
     * payload: Object - Objeto Service completo con todos sus campos
     */
    case 'ADD_SERVICE':
      return {
        ...state,
        services: [...state.services, action.payload]
      };

    /**
     * ADD_QUOTE - Agrega una nueva cotización a un servicio
     * payload: { serviceId: string, quote: Object }
     */
    case 'ADD_QUOTE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.serviceId
            ? {
                ...service,
                quotes: [...(service.quotes || []), action.payload.quote]
              }
            : service
        ),
        quotes: [...state.quotes, action.payload.quote]
      };

    /**
     * MARK_SERVICE_IN_EVALUATION - Cambia el estado del servicio a "En Evaluación"
     * payload: { serviceId: string }
     */
    case 'MARK_SERVICE_IN_EVALUATION':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.serviceId
            ? {
                ...service,
                status: 'En Evaluación'
              }
            : service
        )
      };
    
    // Acciones futuras a implementar:
    // - UPDATE_SERVICE: Actualizar servicio existente
    // - DELETE_SERVICE: Eliminar servicio
    
    // ==================== COTIZACIONES ====================
    
    /**
     * UPDATE_QUOTE - Actualiza una cotización existente
     * payload: { serviceId: string, quoteId: string, quote: Object }
     */
    case 'UPDATE_QUOTE': {
      const { serviceId, quoteId, quote } = action.payload;
      return {
        ...state,
        services: state.services.map(service =>
          service.id === serviceId
            ? {
                ...service,
                quotes: service.quotes?.map(q =>
                  q.id === quoteId ? { ...q, ...quote } : q
                ) || []
              }
            : service
        ),
        quotes: state.quotes.map(q =>
          q.id === quoteId ? { ...q, ...quote } : q
        )
      };
    }

    /**
     * DELETE_QUOTE - Elimina una cotización
     * payload: { serviceId: string, quoteId: string }
     */
    case 'DELETE_QUOTE': {
      const { serviceId, quoteId } = action.payload;
      return {
        ...state,
        services: state.services.map(service =>
          service.id === serviceId
            ? {
                ...service,
                quotes: service.quotes?.filter(q => q.id !== quoteId) || []
              }
            : service
        ),
        quotes: state.quotes.filter(q => q.id !== quoteId)
      };
    }
    
    // ==================== OFERTAS DE INSUMOS ====================
    /**
     * ADD_SUPPLY_OFFER - Agrega una nueva oferta de insumos
     * payload: Object - SupplyOffer con items y totalPrice
     */
    case 'ADD_SUPPLY_OFFER':
      return {
        ...state,
        supplyOffers: [...state.supplyOffers, action.payload]
      };

    /**
     * UPDATE_SERVICE_STATUS - Actualiza el estado de un servicio y su cotización seleccionada
     * payload: { serviceId: string, status: string, selectedQuoteId?: string | null }
     */
    case 'UPDATE_SERVICE_STATUS':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.serviceId
            ? {
                ...service,
                status: action.payload.status ?? service.status,
                selectedQuoteId:
                  action.payload.hasOwnProperty('selectedQuoteId')
                    ? action.payload.selectedQuoteId
                    : service.selectedQuoteId ?? null
              }
            : service
        )
      };

    /**
     * MARK_AS_COMPLETED - Marca un servicio como completado y guarda una valoración
     * payload: { serviceId: string, rating?: number | null }
     */
    case 'MARK_AS_COMPLETED': {
      const { serviceId, rating: ratingValue } = action.payload;
      const targetService = state.services.find((service) => service.id === serviceId);

      if (!targetService) {
        return state;
      }

      let updatedUsers = state.users;

      if (
        typeof ratingValue === 'number' &&
        targetService.selectedQuoteId
      ) {
        const selectedQuote = targetService.quotes?.find(
          (quote) => quote.id === targetService.selectedQuoteId
        );

        if (selectedQuote) {
          updatedUsers = state.users.map((user) => {
            if (user.id !== selectedQuote.serviceProviderId) {
              return user;
            }

            const currentSum =
              typeof user.ratingSum === 'number'
                ? user.ratingSum
                : (typeof user.averageRating === 'number' && typeof user.ratingCount === 'number'
                    ? user.averageRating * user.ratingCount
                    : 0);
            const currentCount =
              typeof user.ratingCount === 'number' ? user.ratingCount : 0;

            const newRatingSum = currentSum + ratingValue;
            const newRatingCount = currentCount + 1;
            const newAverageRating = newRatingSum / newRatingCount;

            return {
              ...user,
              ratingSum: newRatingSum,
              ratingCount: newRatingCount,
              averageRating: Number.isFinite(newAverageRating) ? newAverageRating : 0,
            };
          });
        }
      }

      const updatedServices = state.services.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: 'Completado',
              rating: typeof ratingValue === 'number' ? ratingValue : service.rating ?? null,
            }
          : service
      );

      return {
        ...state,
        services: updatedServices,
        users: updatedUsers,
      };
    }
    
    default:
      return state;
  }
};

