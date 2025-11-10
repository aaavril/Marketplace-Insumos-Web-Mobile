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
    
    // Acciones futuras a implementar:
    // - UPDATE_SERVICE: Actualizar servicio existente
    // - DELETE_SERVICE: Eliminar servicio
    
    // ==================== COTIZACIONES ====================
    // - ADD_QUOTE: Crear nueva cotización
    // - UPDATE_QUOTE: Actualizar cotización
    
    // ==================== OFERTAS DE INSUMOS ====================
    // - ADD_SUPPLY_OFFER: Agregar oferta de insumos
    // - UPDATE_SUPPLY_OFFER: Actualizar oferta de insumos
    
    default:
      return state;
  }
};

