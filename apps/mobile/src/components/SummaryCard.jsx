import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SummaryCard - Tarjeta de resumen para el dashboard
 * @param {string} label - Etiqueta del resumen
 * @param {number} value - Valor numérico a mostrar
 */
export default function SummaryCard({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
});

