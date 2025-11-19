import React, { useState } from 'react';
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
import LocationPicker from '../components/LocationPicker';

/**
 * ServiceFormScreen - Pantalla para publicar un nuevo servicio
 * F7.HU1: Reutiliza la lógica ADD_SERVICE compartida del core-logic
 * Permite a los Solicitantes crear solicitudes de servicio
 */
export default function ServiceFormScreen({ navigation }) {
  const { state, dispatch } = useAppState();

  // Estructura de un insumo (Supply)
  const createEmptySupply = () => ({
    id: Date.now() + Math.random(), // ID único
    name: '',
    quantity: '',
    unit: '',
  });

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [requiredSupplies, setRequiredSupplies] = useState([createEmptySupply()]);
  const [loading, setLoading] = useState(false);

  // Categorías disponibles (debe coincidir con web)
  const categories = [
    { value: 'jardineria', label: 'Jardinería' },
    { value: 'piscinas', label: 'Piscinas' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'construccion', label: 'Construcción' },
    { value: 'electricidad', label: 'Electricidad' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'otros', label: 'Otros' }
  ];

  /**
   * Agrega un nuevo insumo vacío a la lista
   */
  const handleAddSupply = () => {
    setRequiredSupplies([...requiredSupplies, createEmptySupply()]);
  };

  /**
   * Elimina un insumo de la lista por su ID
   * @param {string|number} id - ID del insumo a eliminar
   */
  const handleRemoveSupply = (id) => {
    // No permitir eliminar si solo hay un insumo
    if (requiredSupplies.length > 1) {
      setRequiredSupplies(requiredSupplies.filter((supply) => supply.id !== id));
    }
  };

  /**
   * Actualiza un campo específico de un insumo
   * @param {string|number} id - ID del insumo a actualizar
   * @param {string} field - Campo a actualizar ('name', 'quantity', o 'unit')
   * @param {string} value - Nuevo valor del campo
   */
  const handleSupplyChange = (id, field, value) => {
    setRequiredSupplies(
      requiredSupplies.map((supply) =>
        supply.id === id ? { ...supply, [field]: value } : supply
      )
    );
  };

  /**
   * Maneja el envío del formulario
   * F7.HU1: Utiliza dispatch del Context para enviar ADD_SERVICE
   */
  const handleSubmit = async () => {
    // Validación de campos requeridos
    if (!title.trim() || !description.trim() || !location.trim() || !date.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      // Crear el nuevo servicio según el Modelo de Datos MVP
      // F7.HU1: Payload funcionalmente idéntica a la versión web
      const newService = {
        id: Date.now().toString(), // ID único simple
        title: title.trim(),
        description: description.trim(),
        category: category || 'otros', // Categoría del servicio
        location: location.trim(),
        date: date.trim(),
        status: 'Publicado', // Estado inicial (Regla de Negocio)
        requiredSupplies: requiredSupplies.filter((s) => s.name.trim() !== ''), // Filtrar insumos vacíos
        quotes: [],
        supplyOffers: [],
        selectedQuoteId: null,
        rating: null,
        solicitanteId: state.currentUser.id, // Vinculación con el creador
      };

      // F7.HU1: Despachar la acción para agregar el servicio
      dispatch({ type: 'ADD_SERVICE', payload: newService });

      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation('');
      setDate('');
      setRequiredSupplies([createEmptySupply()]);

      // Mostrar mensaje de éxito y navegar al dashboard
      Alert.alert('Éxito', 'Servicio publicado exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            if (navigation) {
              navigation.goBack();
            }
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al publicar el servicio');
    } finally {
      setLoading(false);
    }
  };

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
          <Text style={styles.headerTitle}>Publicar Servicio</Text>
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
            <Text style={styles.title}>Nueva Solicitud de Servicio</Text>
            <Text style={styles.subtitle}>
              Conectamos tu necesidad con los mejores proveedores en MARKET DEL ESTE
            </Text>

            {/* Campo: Título */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título del Servicio *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ej: Necesito reparación de techo"
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* Campo: Descripción */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe detalladamente el servicio que necesitas..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Campo: Categoría */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoría *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    'Seleccionar Categoría',
                    '',
                    [
                      ...categories.map((cat) => ({
                        text: cat.label,
                        onPress: () => setCategory(cat.value),
                      })),
                      { text: 'Cancelar', style: 'cancel' },
                    ],
                    { cancelable: true }
                  );
                }}
                disabled={loading}
              >
                <Text style={[styles.pickerText, !category && styles.pickerPlaceholder]}>
                  {category
                    ? categories.find((c) => c.value === category)?.label || 'Seleccionar categoría'
                    : 'Seleccionar categoría'}
                </Text>
                <Text style={styles.pickerIcon}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Campo: Ubicación */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Ubicación *</Text>
              <LocationPicker
                value={location}
                onChangeText={setLocation}
                editable={!loading}
              />
            </View>

            {/* Campo: Fecha */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Fecha Deseada *</Text>
              <DatePicker
                value={date}
                onChange={setDate}
                editable={!loading}
              />
            </View>

            {/* Lista dinámica de insumos requeridos */}
            <View style={styles.formGroup}>
              <View style={styles.suppliesHeader}>
                <Text style={styles.label}>Insumos Requeridos</Text>
                <TouchableOpacity
                  onPress={handleAddSupply}
                  style={styles.addButton}
                  disabled={loading}
                >
                  <Text style={styles.addButtonText}>+ Agregar Insumo</Text>
                </TouchableOpacity>
              </View>

              {requiredSupplies.map((supply, index) => (
                <View key={supply.id} style={styles.supplyItem}>
                  <View style={styles.supplyInputs}>
                    <View style={styles.supplyField}>
                      <Text style={styles.supplyLabel}>Nombre del Insumo</Text>
                      <TextInput
                        style={styles.supplyInput}
                        value={supply.name}
                        onChangeText={(value) =>
                          handleSupplyChange(supply.id, 'name', value)
                        }
                        placeholder="Ej: Cemento, Pintura, etc."
                        placeholderTextColor="#999"
                        editable={!loading}
                      />
                    </View>

                    <View style={styles.supplyField}>
                      <Text style={styles.supplyLabel}>Cantidad</Text>
                      <TextInput
                        style={styles.supplyInput}
                        value={supply.quantity}
                        onChangeText={(value) =>
                          handleSupplyChange(supply.id, 'quantity', value)
                        }
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        editable={!loading}
                      />
                    </View>

                    <View style={styles.supplyField}>
                      <Text style={styles.supplyLabel}>Unidad</Text>
                      <TextInput
                        style={styles.supplyInput}
                        value={supply.unit}
                        onChangeText={(value) =>
                          handleSupplyChange(supply.id, 'unit', value)
                        }
                        placeholder="kg, litros, unidades..."
                        placeholderTextColor="#999"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {requiredSupplies.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveSupply(supply.id)}
                      style={styles.removeButton}
                      disabled={loading}
                    >
                      <Text style={styles.removeButtonText}>✕ Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <Text style={styles.hint}>
                Agrega los insumos que necesitas para realizar el servicio. Los campos vacíos no se
                guardarán.
              </Text>
            </View>

            {/* Botón de envío */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Publicando...' : 'Publicar Servicio'}
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
  suppliesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  supplyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  supplyInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  supplyField: {
    flex: 1,
    minWidth: '30%',
  },
  supplyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  supplyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#333',
  },
  removeButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  removeButtonText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  pickerPlaceholder: {
    color: '#999',
  },
  pickerIcon: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
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
});

