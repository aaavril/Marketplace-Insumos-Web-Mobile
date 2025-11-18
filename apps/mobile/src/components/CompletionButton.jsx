import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';

const ratingOptions = [
  { value: '', label: 'Sin valoración' },
  { value: '5', label: '⭐⭐⭐⭐⭐ (Excelente)' },
  { value: '4', label: '⭐⭐⭐⭐ (Muy bueno)' },
  { value: '3', label: '⭐⭐⭐ (Bueno)' },
  { value: '2', label: '⭐⭐ (Regular)' },
  { value: '1', label: '⭐ (Deficiente)' },
];

/**
 * CompletionButton - Botón para marcar servicio como completado con rating
 * Permite a los Solicitantes marcar un servicio como completado y dar rating al proveedor
 */
export default function CompletionButton({ serviceId, onCompleted }) {
  const { dispatch } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      dispatch({
        type: 'MARK_AS_COMPLETED',
        payload: {
          serviceId,
          rating: rating ? Number(rating) : null,
        },
      });

      setSuccess(true);
      setShowForm(false);
      setRating('');

      if (typeof onCompleted === 'function') {
        onCompleted();
      }

      Alert.alert(
        'Éxito',
        'Servicio marcado como completado. ¡Gracias por usar MARKET DEL ESTE!'
      );
    } catch (err) {
      const errorMessage = 'No pudimos completar la acción. Intenta nuevamente.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setRating('');
    setError('');
  };

  if (!showForm) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.completeButtonText}>
            Marcar servicio como completado
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal
      visible={showForm}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Completar Servicio</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>
                ¿Cómo calificarías al proveedor?
              </Text>

              <View style={styles.ratingOptions}>
                {ratingOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value || 'no-rating'}
                    style={[
                      styles.ratingOption,
                      rating === option.value && styles.ratingOptionSelected,
                    ]}
                    onPress={() => setRating(option.value)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.ratingOptionText,
                        rating === option.value && styles.ratingOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {success && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>
                    ¡Servicio marcado como completado!
                  </Text>
                </View>
              )}

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.confirmButton, loading && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.confirmButtonText}>
                    {loading ? 'Guardando...' : 'Confirmar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  formContent: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  ratingOptions: {
    gap: 12,
    marginBottom: 24,
  },
  ratingOption: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#eee',
  },
  ratingOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  ratingOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  ratingOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
  },
  successContainer: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  successText: {
    fontSize: 14,
    color: '#166534',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
});

