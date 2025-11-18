import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

/**
 * LocationPicker - Componente para seleccionar ubicación con sugerencias comunes
 * @param {string} value - Valor actual de la ubicación
 * @param {Function} onChangeText - Función que se ejecuta al cambiar el valor
 * @param {boolean} editable - Si el campo es editable
 */
export default function LocationPicker({ value, onChangeText, editable = true }) {
  const [showModal, setShowModal] = useState(false);

  // Ubicaciones comunes en Uruguay
  const commonLocations = [
    'Montevideo, Centro',
    'Montevideo, Pocitos',
    'Montevideo, Cordón',
    'Montevideo, Palermo',
    'Montevideo, Malvín',
    'Montevideo, Carrasco',
    'Canelones',
    'Ciudad de la Costa',
    'Las Piedras',
    'Pando',
    'Maldonado, Punta del Este',
    'Maldonado, Maldonado',
    'Colonia del Sacramento',
    'Salto',
    'Paysandú',
    'Rivera',
    'Tacuarembó',
    'Mercedes',
    'Minas',
    'San José de Mayo',
    'Florida',
    'Durazno',
  ];

  const handleSelectLocation = (location) => {
    onChangeText(location);
    setShowModal(false);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Ej: Montevideo, Centro"
          placeholderTextColor="#999"
          editable={editable}
        />
        <TouchableOpacity
          onPress={() => editable && setShowModal(true)}
          style={styles.iconButton}
          disabled={!editable}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>📍</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContent}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Seleccionar Ubicación</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModal(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.locationList}
                  showsVerticalScrollIndicator={true}
                >
                  {commonLocations.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={styles.locationItem}
                      onPress={() => handleSelectLocation(location)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.locationItemText}>{location}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={styles.modalFooter}>
                  <Text style={styles.footerText}>
                    O escribe tu ubicación personalizada en el campo de texto
                  </Text>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowModal(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  iconButton: {
    position: 'absolute',
    right: 8,
    padding: 8,
    zIndex: 1,
  },
  icon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  locationList: {
    maxHeight: 400,
  },
  locationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

