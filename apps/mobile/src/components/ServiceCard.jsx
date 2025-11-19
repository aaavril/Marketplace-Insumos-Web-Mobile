import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getRatingLabel } from '../utils/helpers';

/**
 * ServiceCard - Tarjeta de servicio para el dashboard
 * @param {Object} service - Datos del servicio
 * @param {string|null} assignedProvider - Nombre del proveedor asignado
 * @param {Function} onPress - Función que se ejecuta al tocar "Ver detalle" o toda la tarjeta
 */
export default function ServiceCard({ service, assignedProvider, onPress }) {
  const quotesCount = service.quotes?.length || 0;
  const ratingLabel = getRatingLabel(service.rating);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
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
      <Text style={styles.description} numberOfLines={3}>
        {service.description}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>📅 {service.date}</Text>
        <Text style={styles.metaText}>📍 {service.location}</Text>
      </View>
      {assignedProvider && (
        <View style={styles.providerChip}>
          <Text style={styles.providerChipText}>
            👷 Prestador: {assignedProvider}
          </Text>
        </View>
      )}
      {ratingLabel && (
        <View style={styles.ratingChip}>
          <Text style={styles.ratingChipText}>⭐ {ratingLabel}</Text>
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.quotesChip}>
          <Text style={styles.quotesChipText}>
            {quotesCount} cotización{quotesCount !== 1 ? 'es' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Text style={styles.detailButtonText}>Ver detalle →</Text>
        </TouchableOpacity>
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
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    lineHeight: 24,
    flex: 1,
    minWidth: '60%',
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976d2',
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
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#888',
  },
  providerChip: {
    backgroundColor: '#f0f7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  providerChipText: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '500',
  },
  ratingChip: {
    backgroundColor: '#fff9e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  ratingChipText: {
    fontSize: 13,
    color: '#cc9900',
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
  detailButton: {
    paddingVertical: 4,
  },
  detailButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

