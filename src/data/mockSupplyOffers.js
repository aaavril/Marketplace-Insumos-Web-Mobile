/**
 * Mock Supply Offers - Packs de insumos publicados por proveedores
 */

export const MOCK_SUPPLY_OFFERS = [
  {
    id: 'so1',
    providerId: 'u3', // Pedro Insumos
    providerName: 'Pedro Insumos',
    title: 'Pack Construcción Obra Gruesa',
    description: 'Ideal para reparaciones estructurales y ampliaciones pequeñas.',
    totalPrice: 950,
    items: [
      { name: 'Cemento Portland', quantity: '40', unit: 'bolsas' },
      { name: 'Arena fina', quantity: '3', unit: 'm³' },
      { name: 'Varillas de hierro 8mm', quantity: '50', unit: 'unidades' }
    ],
    createdAt: '2024-02-01T12:00:00.000Z'
  },
  {
    id: 'so2',
    providerId: 'u3',
    providerName: 'Pedro Insumos',
    title: 'Pack Terminaciones Premium',
    description: 'Solución completa para pintura interior y exterior de viviendas.',
    totalPrice: 680,
    items: [
      { name: 'Pintura látex interior', quantity: '30', unit: 'litros' },
      { name: 'Pintura látex exterior', quantity: '20', unit: 'litros' },
      { name: 'Rodillos profesionales', quantity: '6', unit: 'unidades' },
      { name: 'Cintas de enmascarar', quantity: '10', unit: 'rollos' }
    ],
    createdAt: '2024-02-05T09:30:00.000Z'
  }
];

