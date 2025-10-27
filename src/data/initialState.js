/**
 * Mock Users - Datos de prueba para el MVP
 * Roles disponibles: 'Solicitante', 'Proveedor de Servicio', 'Proveedor de Insumos'
 */
export const MOCK_USERS = [
  { 
    id: 'u1', 
    name: 'Alfonso Solicitante', 
    email: 'solicitante@mail.com', 
    password: '123', 
    role: 'Solicitante' 
  },
  { 
    id: 'u2', 
    name: 'Laura Proveedora', 
    email: 'servicio@mail.com', 
    password: '123', 
    role: 'Proveedor de Servicio' 
  },
  { 
    id: 'u3', 
    name: 'Pedro Insumos', 
    email: 'insumos@mail.com', 
    password: '123', 
    role: 'Proveedor de Insumos' 
  },
];

/**
 * Estado inicial de la aplicación
 * Contiene todas las entidades principales del modelo de datos
 */
export const initialState = {
  services: [],           // Servicios publicados por proveedores
  users: MOCK_USERS,      // Usuarios del sistema
  currentUser: null,      // Usuario actualmente autenticado
  quotes: [],             // Cotizaciones realizadas
  supplyOffers: []        // Ofertas de insumos disponibles
};

