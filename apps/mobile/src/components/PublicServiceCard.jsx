import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * PublicServiceCard - Tarjeta de servicio público para proveedores
 * @param {Object} service - Datos del servicio
 * @param {Function} onPress - Función que se ejecuta al tocar la tarjeta
 */
export default function PublicServiceCard({ service, onPress }) {
  const quotesCount = service.quotes?.length || 0;
  const suppliesCount = service.requiredSupplies?.length || 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{service.title}</Text>
          {service.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {service.category === 'jardineria' ? 'Jardinería' :
                 service.category === 'piscinas' ? 'Piscinas' :
                 service.category === 'limpieza' ? 'Limpieza' :
                 service.category === 'construccion' ? 'Construcción' :
                 service.category === 'electricidad' ? 'Electricidad' :
                 service.category === 'plomeria' ? 'Plomería' :
                 service.category === 'pintura' ? 'Pintura' :
                 service.category === 'otros' ? 'Otros' : service.category}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{service.status}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={3}>
        {service.description}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>📅 {service.date}</Text>
        <Text style={styles.metaText}>📍 {service.location}</Text>
      </View>
      {suppliesCount > 0 && (
        <View style={styles.suppliesInfo}>
          <Text style={styles.suppliesText}>
            📦 {suppliesCount} insumo{suppliesCount !== 1 ? 's' : ''} requerido{suppliesCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.quotesChip}>
          <Text style={styles.quotesChipText}>
            {quotesCount} cotización{quotesCount !== 1 ? 'es' : ''}
          </Text>
        </View>
        <View style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Cotizar →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    lineHeight: 24,
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976d2',
  },
  statusBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#888',
  },
  suppliesInfo: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  suppliesText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quotesChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quotesChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
});

