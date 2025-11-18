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

/**
 * SupplyOfferFormScreen - Formulario de oferta de packs para Proveedor de Insumos
 * Reutiliza la lógica ADD_SUPPLY_OFFER compartida del core-logic
 * Permite a los Proveedores de Insumos publicar ofertas de packs
 */
export default function SupplyOfferFormScreen({ navigation, route }) {
  const { state, dispatch } = useAppState();
  const { serviceId, service } = route?.params || {};
  
  const currentUser = state.currentUser;

  // Estructura de un item de insumo
  const createEmptyItem = () => ({
    id: Date.now() + Math.random(),
    name: '',
    quantity: '',
    unit: '',
  });

  // Estados del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [items, setItems] = useState([createEmptyItem()]);
  const [loading, setLoading] = useState(false);

  /**
   * Agrega un nuevo item vacío a la lista
   */
  const handleAddItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  /**
   * Elimina un item de la lista por su ID
   */
  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  /**
   * Actualiza un campo específico de un item
   */
  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  /**
   * Maneja el envío del formulario de oferta
   * Utiliza dispatch del Context para enviar ADD_SUPPLY_OFFER
   */
  const handleSubmit = async () => {
    // Validación de campos requeridos
    if (!title.trim() || !totalPrice.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    const priceValue = parseFloat(totalPrice);

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Error', 'Ingresa un precio total válido mayor a cero');
      return;
    }

    const parsedItems = items
      .filter((item) => item.name.trim() !== '')
      .map((item) => ({
        name: item.name.trim(),
        quantity: item.quantity,
        unit: item.unit,
      }));

    if (parsedItems.length === 0) {
      Alert.alert('Error', 'Agrega al menos un insumo al pack');
      return;
    }

    setLoading(true);

    try {
      // Crear la nueva oferta según el Modelo de Datos MVP
      // Payload funcionalmente idéntica a la versión web
      const offer = {
        id: Date.now().toString(),
        providerId: currentUser.id,
        providerName: currentUser.name,
        title: title.trim(),
        description: description.trim(),
        totalPrice: priceValue,
        items: parsedItems,
        createdAt: new Date().toISOString(),
      };

      // Despachar la acción para agregar la oferta
      dispatch({ type: 'ADD_SUPPLY_OFFER', payload: offer });

      // Limpiar el formulario
      setTitle('');
      setDescription('');
      setTotalPrice('');
      setItems([createEmptyItem()]);

      // Mostrar mensaje de éxito y navegar atrás
      Alert.alert(
        'Éxito',
        'Oferta publicada exitosamente. Los solicitantes podrán verla en su panel.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (navigation) {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err.message || 'Error al publicar la oferta');
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
          <Text style={styles.headerTitle}>Publicar Pack</Text>
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
            {/* Información del servicio si viene de un servicio específico */}
            {service && (
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>Oferta para: {service.title}</Text>
                <Text style={styles.serviceLocation}>📍 {service.location}</Text>
              </View>
            )}

            <Text style={styles.title}>Nueva Oferta de Pack de Insumos</Text>
            <Text style={styles.subtitle}>
              Crea una oferta de insumos para que los solicitantes la consideren
            </Text>

            {/* Campo: Nombre del Pack */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre del Pack *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ej: Pack Obra Gruesa"
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            {/* Campo: Descripción */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe qué incluye este pack y sus beneficios..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!loading}
              />
            </View>

            {/* Campo: Precio Total */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Precio Total (USD) *</Text>
              <TextInput
                style={styles.input}
                value={totalPrice}
                onChangeText={setTotalPrice}
                placeholder="Ej: 850"
                placeholderTextColor="#999"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            {/* Lista dinámica de insumos */}
            <View style={styles.formGroup}>
              <View style={styles.itemsHeader}>
                <Text style={styles.label}>Insumos Incluidos</Text>
                <TouchableOpacity
                  onPress={handleAddItem}
                  style={styles.addButton}
                  disabled={loading}
                >
                  <Text style={styles.addButtonText}>+ Agregar Insumo</Text>
                </TouchableOpacity>
              </View>

              {items.map((item, index) => (
                <View key={item.id} style={styles.itemContainer}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemField}>
                      <Text style={styles.itemLabel}>Nombre *</Text>
                      <TextInput
                        style={styles.itemInput}
                        value={item.name}
                        onChangeText={(value) => handleItemChange(item.id, 'name', value)}
                        placeholder="Ej: Cemento Portland"
                        placeholderTextColor="#999"
                        editable={!loading}
                      />
                    </View>

                    <View style={styles.itemField}>
                      <Text style={styles.itemLabel}>Cantidad</Text>
                      <TextInput
                        style={styles.itemInput}
                        value={item.quantity}
                        onChangeText={(value) => handleItemChange(item.id, 'quantity', value)}
                        placeholder="50"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        editable={!loading}
                      />
                    </View>

                    <View style={styles.itemField}>
                      <Text style={styles.itemLabel}>Unidad</Text>
                      <TextInput
                        style={styles.itemInput}
                        value={item.unit}
                        onChangeText={(value) => handleItemChange(item.id, 'unit', value)}
                        placeholder="bolsas"
                        placeholderTextColor="#999"
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {items.length > 1 && (
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      style={styles.removeButton}
                      disabled={loading}
                    >
                      <Text style={styles.removeButtonText}>✕ Eliminar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <Text style={styles.hint}>
                Agrega los insumos incluidos en este pack. Los campos vacíos no se guardarán.
              </Text>
            </View>

            {/* Botón de envío */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Publicando...' : 'Publicar Oferta'}
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
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  serviceLocation: {
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
  itemsHeader: {
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
  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemField: {
    flex: 1,
    minWidth: '30%',
  },
  itemLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  itemInput: {
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

