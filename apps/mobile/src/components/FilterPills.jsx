import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

/**
 * FilterPills - Componente de filtros horizontales tipo pills
 * @param {Array} filters - Array de filtros { key, label }
 * @param {string} activeFilter - Filtro activo actual
 * @param {Function} onFilterChange - Función que se ejecuta al cambiar el filtro
 */
export default function FilterPills({ filters, activeFilter, onFilterChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {filters.map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[styles.pill, activeFilter === key && styles.pillActive]}
          onPress={() => onFilterChange(key)}
        >
          <Text
            style={[
              styles.pillText,
              activeFilter === key && styles.pillTextActive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -4,
  },
  content: {
    gap: 8,
    paddingRight: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  pillActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

