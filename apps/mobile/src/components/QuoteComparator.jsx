import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { getRatingLabel, getProviderName } from '../utils/helpers';

/**
 * QuoteComparator - Comparador de cotizaciones para Solicitante
 * Permite comparar cotizaciones recibidas ordenándolas por precio o duración
 */
export default function QuoteComparator({
  quotes = [],
  getProviderName,
  users = [],
  onClose,
  selectedQuoteId,
  completedRatingLabel = null,
  serviceStatus = '',
  onSelectQuote,
}) {
  const [sortOption, setSortOption] = useState('price');

  const getProviderProfile = (providerId) =>
    users.find((user) => user.id === providerId) ?? null;

  const getDurationValue = (quote) => {
    if (typeof quote.duration === 'number' && !Number.isNaN(quote.duration)) {
      return quote.duration;
    }
    return Number.POSITIVE_INFINITY;
  };

  const sortedQuotes = useMemo(() => {
    const list = [...quotes];

    if (sortOption === 'duration') {
      return list.sort((a, b) => getDurationValue(a) - getDurationValue(b));
    }

    return list.sort((a, b) => a.price - b.price);
  }, [quotes, sortOption]);

  const getQuoteStateLabel = (quote) => {
    const isSelected = selectedQuoteId === quote.id;
    if (!isSelected) return 'Disponible';

    if (serviceStatus === 'Completado') {
      return completedRatingLabel
        ? `Completado · ${completedRatingLabel}`
        : 'Completado';
    } else if (serviceStatus === 'Asignado') {
      return 'Asignada';
    } else if (serviceStatus === 'En Evaluación') {
      return 'En evaluación';
    }
    return 'Seleccionada';
  };

  const renderQuoteItem = ({ item: quote }) => {
    const isSelected = selectedQuoteId === quote.id;
    const providerProfile = getProviderProfile(quote.serviceProviderId);
    const providerHasRatings = providerProfile && (providerProfile.ratingCount ?? 0) > 0;
    const providerRatingLabel = providerHasRatings
      ? `⭐ ${Number(providerProfile.averageRating || 0).toFixed(1)}/5 (${providerProfile.ratingCount})`
      : 'Sin valoraciones';

    const stateLabel = getQuoteStateLabel(quote);

    return (
      <View style={[styles.quoteRow, isSelected && styles.quoteRowSelected]}>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText}>{getProviderName(quote.serviceProviderId)}</Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText}>{providerRatingLabel}</Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText}>
            {quote.price.toLocaleString('es-UY', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText}>
            {quote.duration ? `${quote.duration}` : '—'}
          </Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText}>{quote.deadline || '—'}</Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={[styles.quoteCellText, isSelected && styles.selectedState]}>
            {stateLabel}
          </Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText} numberOfLines={2}>
            {quote.notes || '—'}
          </Text>
        </View>
        <View style={styles.quoteCell}>
          <Text style={styles.quoteCellText}>
            {quote.createdAt
              ? new Date(quote.createdAt).toLocaleDateString('es-UY')
              : 'Sin fecha'}
          </Text>
        </View>
        {!isSelected && serviceStatus !== 'Completado' && onSelectQuote && (
          <View style={styles.quoteCell}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => onSelectQuote(quote.id)}
            >
              <Text style={styles.selectButtonText}>Seleccionar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Comparador de Cotizaciones</Text>
            <Text style={styles.subtitle}>
              Analiza cada propuesta y selecciona la que mejor se adapte a tu proyecto.
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controls}>
          <Text style={styles.sortLabel}>Ordenar por</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, sortOption === 'price' && styles.sortButtonActive]}
              onPress={() => setSortOption('price')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortOption === 'price' && styles.sortButtonTextActive,
                ]}
              >
                Menor precio
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortOption === 'duration' && styles.sortButtonActive]}
              onPress={() => setSortOption('duration')}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortOption === 'duration' && styles.sortButtonTextActive,
                ]}
              >
                Menor duración
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.helper}>
          <Text style={styles.helperText}>
            {sortOption === 'price'
              ? 'Ordenadas de menor a mayor precio total.'
              : 'Ordenadas por menor duración estimada (días).'}
          </Text>
        </View>

        {sortedQuotes.length > 0 ? (
          <ScrollView horizontal style={styles.tableContainer}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Proveedor</Text>
                <Text style={styles.headerCell}>Rating</Text>
                <Text style={styles.headerCell}>Precio (USD)</Text>
                <Text style={styles.headerCell}>Duración (días)</Text>
                <Text style={styles.headerCell}>Plazo estimado</Text>
                <Text style={styles.headerCell}>Estado</Text>
                <Text style={styles.headerCell}>Notas</Text>
                <Text style={styles.headerCell}>Fecha de envío</Text>
                {onSelectQuote && <Text style={styles.headerCell}>Acción</Text>}
              </View>
              <FlatList
                data={sortedQuotes}
                keyExtractor={(item) => item.id}
                renderItem={renderQuoteItem}
                scrollEnabled={false}
              />
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Todavía no hay cotizaciones para comparar.
            </Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  helper: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    minWidth: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    minWidth: 100,
    paddingHorizontal: 8,
  },
  quoteRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  quoteRowSelected: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  quoteCell: {
    minWidth: 100,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  quoteCellText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  selectedState: {
    fontWeight: '700',
    color: '#007AFF',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

