import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useAppState } from '../../../../packages/core-logic/src/context/GlobalStateContext';
import DatePicker from '../components/DatePicker';

/**
 * QuoteFormScreen - Formulario de cotización para Proveedor de Servicio
 * Reutiliza la lógica ADD_QUOTE compartida del core-logic
 * Permite a los Proveedores de Servicio enviar cotizaciones
 */
export default function QuoteFormScreen({ navigation, route }) {
  const { state, dispatch } = useAppState();
  const { serviceId, service, editingQuote } = route.params || {};
  
  const currentUser = state.currentUser;

  // Estados del formulario - prellenar si estamos editando
  const [totalPrice, setTotalPrice] = useState(editingQuote?.price?.toString() || '');
  const [deadline, setDeadline] = useState(editingQuote?.deadline || '');
  const [duration, setDuration] = useState(editingQuote?.duration?.toString() || '');
  const [notes, setNotes] = useState(editingQuote?.notes || '');
  const [loading, setLoading] = useState(false);

  // Obtener el servicio si no viene en route.params
  const currentService = service || state.services.find((s) => s.id === serviceId);
  const isServiceAssigned = currentService?.status === 'Asignado' || currentService?.status === 'Completado';

  useEffect(() => {
    if (!currentService && serviceId) {
      Alert.alert('Error', 'Servicio no encontrado', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [currentService, serviceId, navigation]);

  // Actualizar campos cuando cambia editingQuote
  useEffect(() => {
    if (editingQuote) {
      setTotalPrice(editingQuote.price?.toString() || '');
      setDeadline(editingQuote.deadline || '');
      setDuration(editingQuote.duration?.toString() || '');
      setNotes(editingQuote.notes || '');
    }
  }, [editingQuote]);

  // Bloquear formulario si el servicio está asignado o completado
  if (isServiceAssigned) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Cotización</Text>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.blockedContainer}>
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>Cotizaciones cerradas</Text>
            <Text style={styles.warningText}>
              Este servicio ya ha sido asignado a un proveedor. No se pueden agregar nuevas cotizaciones.
            </Text>
            <TouchableOpacity
              style={styles.backButtonBlocked}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonBlockedText}>Volver al detalle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /**
   * Maneja el envío del formulario de cotización
   * Utiliza dispatch del Context para enviar ADD_QUOTE
   */
  const handleSubmit = async () => {
    // Verificar que el servicio aún esté disponible para cotizar
    const updatedService = state.services.find((s) => s.id === serviceId);
    if (updatedService?.status === 'Asignado' || updatedService?.status === 'Completado') {
      Alert.alert('Error', 'Este servicio ya ha sido asignado. No se pueden agregar nuevas cotizaciones.');
      return;
    }

    // Validación de campos requeridos
    if (!totalPrice.trim() || !deadline.trim() || !duration.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const priceValue = parseFloat(totalPrice);
    const durationValue = parseInt(duration, 10);

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Ingresa un precio válido mayor a cero');
      return;
    }

    if (Number.isNaN(durationValue) || durationValue <= 0) {
      Alert.alert('Error', 'Ingresa una duración estimada en días (mayor a cero)');
      return;
    }

    if (!serviceId || !currentService) {
      Alert.alert('Error', 'ID de servicio no válido');
      return;
    }

    setLoading(true);

    try {
      // Si estamos editando, actualizar. Si no, crear nueva.
      if (editingQuote) {
        const updatedQuote = {
          ...editingQuote,
          price: priceValue,
          deadline: deadline.trim(),
          duration: durationValue,
          notes: notes.trim()
        };
        
        dispatch({
          type: 'UPDATE_QUOTE',
          payload: {
            serviceId,
            quoteId: editingQuote.id,
            quote: updatedQuote
          }
        });

        Alert.alert('Éxito', 'Cotización actualizada correctamente.', [
          {
            text: 'OK',
            onPress: () => {
              if (navigation) {
                navigation.goBack();
              }
            },
          },
        ]);
      } else {
        // Crear la nueva cotización según el Modelo de Datos MVP
        // Payload funcionalmente idéntica a la versión web
        const newQuote = {
          id: Date.now().toString(),
          serviceId,
          serviceProviderId: currentUser.id,
          price: priceValue,
          deadline: deadline.trim(),
          duration: durationValue,
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
        };

        // Despachar la acción para agregar la cotización
        dispatch({ type: 'ADD_QUOTE', payload: { serviceId, quote: newQuote } });

        // Limpiar el formulario
        setTotalPrice('');
        setDeadline('');
        setDuration('');
        setNotes('');

        // Mostrar mensaje de éxito y navegar atrás
        Alert.alert('Éxito', 'Cotización enviada correctamente. El solicitante revisará tu propuesta.', [
          {
            text: 'OK',
            onPress: () => {
              if (navigation) {
                navigation.goBack();
              }
            },
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al enviar la cotización');
    } finally {
      setLoading(false);
    }
  };

  if (!currentService) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con botón volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {editingQuote ? 'Editar Cotización' : 'Enviar Cotización'}
          </Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {/* Información del servicio */}
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{currentService.title}</Text>
              <Text style={styles.serviceLocation}>📍 {currentService.location}</Text>
              <Text style={styles.serviceDate}>📅 {currentService.date}</Text>
            </View>

            <Text style={styles.title}>
              {editingQuote ? 'Edita tu Cotización' : 'Completa tu Cotización'}
            </Text>
            <Text style={styles.subtitle}>
              {editingQuote
                ? 'Modifica los datos de tu cotización'
                : 'Envía tu propuesta para este servicio en MARKET DEL ESTE'}
            </Text>

            {/* Campo: Precio Total */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Precio Total Estimado (USD) *</Text>
              <TextInput
                style={styles.input}
                value={totalPrice}
                onChangeText={setTotalPrice}
                placeholder="Ej: 1500"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Campo: Plazo Estimado */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Plazo Estimado *</Text>
              <DatePicker
                value={deadline}
                onChange={setDeadline}
                editable={!loading}
              />
            </View>

            {/* Campo: Duración Estimada */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Duración Estimada (días) *</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="Ej: 5"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Campo: Notas Adicionales */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notas Adicionales</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Describe detalles importantes: materiales, tiempos, condiciones..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Botón de envío */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading 
                  ? (editingQuote ? 'Guardando...' : 'Enviando...')
                  : (editingQuote ? 'Guardar Cambios' : 'Enviar Cotización')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerPlaceholder: {
    width: 80,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  serviceLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 28,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  blockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    maxWidth: 400,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  backButtonBlocked: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonBlockedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

