/**
 * Mock Services - Datos de prueba para servicios publicados
 * Estos servicios tienen status 'Publicado' y están disponibles para cotización
 */

export const MOCK_SERVICES = [
  {
    id: 's1',
    title: 'Reparación de Techo y Fachada',
    description: 'Necesito reparar el techo de mi casa en Punta del Este. Hay filtraciones y necesito arreglar también la fachada. Requiero trabajo profesional y con garantía.',
    location: 'Punta del Este, Barrio Parque del Golf',
    date: '2024-02-15',
    status: 'Publicado',
    requiredSupplies: [
      { id: 1, name: 'Cemento', quantity: '10', unit: 'bolsas' },
      { id: 2, name: 'Tejas', quantity: '200', unit: 'unidades' },
      { id: 3, name: 'Pintura exterior', quantity: '20', unit: 'litros' }
    ],
    quotes: [],
    supplyOffers: [],
    solicitanteId: 'u1'
  },
  {
    id: 's2',
    title: 'Instalación de Sistema Eléctrico',
    description: 'Requiero instalación completa de sistema eléctrico para nueva construcción en La Barra. Necesito certificación y cumplimiento de normas.',
    location: 'La Barra, Maldonado',
    date: '2024-02-20',
    status: 'Publicado',
    requiredSupplies: [
      { id: 1, name: 'Cable eléctrico', quantity: '500', unit: 'metros' },
      { id: 2, name: 'Interruptores', quantity: '15', unit: 'unidades' },
      { id: 3, name: 'Tablero principal', quantity: '1', unit: 'unidad' }
    ],
    quotes: [],
    supplyOffers: [],
    solicitanteId: 'u1'
  },
  {
    id: 's3',
    title: 'Construcción de Deck en Playa',
    description: 'Quiero construir un deck de madera en la playa de mi propiedad. Debe ser resistente a la humedad y salitre. Aproximadamente 50m².',
    location: 'Punta del Este, Playa Mansa',
    date: '2024-03-01',
    status: 'Publicado',
    requiredSupplies: [
      { id: 1, name: 'Madera tratada', quantity: '200', unit: 'metros' },
      { id: 2, name: 'Tornillos inoxidables', quantity: '1000', unit: 'unidades' },
      { id: 3, name: 'Barniz marino', quantity: '30', unit: 'litros' }
    ],
    quotes: [],
    supplyOffers: [],
    solicitanteId: 'u1'
  },
  {
    id: 's4',
    title: 'Pintura Interior Completa',
    description: 'Necesito pintar todas las habitaciones de mi apartamento. Son 3 dormitorios, living y cocina. Preferencia por colores claros.',
    location: 'Punta del Este, Centro',
    date: '2024-02-25',
    status: 'Publicado',
    requiredSupplies: [
      { id: 1, name: 'Pintura látex', quantity: '40', unit: 'litros' },
      { id: 2, name: 'Rodillos', quantity: '5', unit: 'unidades' },
      { id: 3, name: 'Cinta de papel', quantity: '10', unit: 'rollos' }
    ],
    quotes: [],
    supplyOffers: [],
    solicitanteId: 'u1'
  },
  {
    id: 's5',
    title: 'Instalación de Aire Acondicionado',
    description: 'Requiero instalación de 4 equipos split en diferentes habitaciones. Necesito profesional certificado y con experiencia.',
    location: 'Punta del Este, Avenida Gorlero',
    date: '2024-02-28',
    status: 'Publicado',
    requiredSupplies: [
      { id: 1, name: 'Aires acondicionados', quantity: '4', unit: 'unidades' },
      { id: 2, name: 'Tubería de cobre', quantity: '50', unit: 'metros' },
      { id: 3, name: 'Aislante térmico', quantity: '20', unit: 'metros' }
    ],
    quotes: [],
    supplyOffers: [],
    solicitanteId: 'u1'
  }
];

