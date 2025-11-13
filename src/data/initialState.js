import { MOCK_SERVICES } from './mockServices';
import { MOCK_SUPPLY_OFFERS } from './mockSupplyOffers';

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
  { 
    id: 'u4', 
    name: 'Mariana Servicios', 
    email: 'serviciosplus@mail.com', 
    password: '123', 
    role: 'Proveedor de Servicio' 
  },
];

/**
 * Estado inicial de la aplicación
 * Contiene todas las entidades principales del modelo de datos
 * 
 * NOTA: MOCK_SERVICES se incluyen para desarrollo y pruebas
 * En producción, services iniciaría como un array vacío []
 */
export const initialState = {
  services: MOCK_SERVICES,  // Servicios publicados (mock para desarrollo)
  users: MOCK_USERS,         // Usuarios del sistema
  currentUser: null,         // Usuario actualmente autenticado
  quotes: [],                // Cotizaciones realizadas
  supplyOffers: MOCK_SUPPLY_OFFERS // Ofertas de insumos disponibles (mock)
};

