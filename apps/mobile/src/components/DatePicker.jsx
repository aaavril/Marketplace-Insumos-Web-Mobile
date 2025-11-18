import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * DatePicker - Componente para seleccionar fecha con mejor UX
 * @param {string} value - Valor actual de la fecha en formato YYYY-MM-DD
 * @param {Function} onChange - Función que se ejecuta al cambiar la fecha (recibe YYYY-MM-DD)
 * @param {boolean} editable - Si el campo es editable
 */
export default function DatePicker({ value, onChange, editable = true }) {
  // Función helper para parsear fecha
  const parseDate = (dateString) => {
    if (!dateString) return new Date();
    // Si es string YYYY-MM-DD
    if (typeof dateString === 'string' && dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
    }
    return new Date(dateString);
  };

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => parseDate(value));

  // Sincronizar selectedDate cuando cambia value desde fuera
  useEffect(() => {
    if (value) {
      setSelectedDate(parseDate(value));
    }
  }, [value]);

  // Formatear fecha a YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Formatear fecha para mostrar
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = parseDate(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('es-UY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && date) {
        const formattedDate = formatDate(date);
        if (formattedDate) {
          setSelectedDate(date);
          onChange(formattedDate);
        }
      }
    } else {
      // iOS: solo actualizar selectedDate, no llamar onChange hasta confirmar
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const handleConfirm = () => {
    const formattedDate = formatDate(selectedDate);
    if (formattedDate) {
      onChange(formattedDate);
    }
    setShowPicker(false);
  };

  const handleCancel = () => {
    // Resetear a la fecha original
    if (value) {
      setSelectedDate(parseDate(value));
    } else {
      setSelectedDate(new Date());
    }
    setShowPicker(false);
  };

  const handleOpen = () => {
    if (editable) {
      // Resetear a la fecha actual o la fecha guardada
      if (value) {
        setSelectedDate(parseDate(value));
      } else {
        setSelectedDate(new Date());
      }
      setShowPicker(true);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.inputContainer, !editable && styles.inputDisabled]}
        onPress={handleOpen}
        disabled={!editable}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]}>
          {value ? formatDisplayDate(value) : 'Selecciona una fecha'}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && showPicker && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowPicker(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleCancel}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Seleccionar Fecha</Text>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleConfirm}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.modalButtonText, styles.modalButtonConfirm]}>
                        Confirmar
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerContainer}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      locale="es-ES"
                      textColor="#333"
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
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
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingRight: 8,
  },
  placeholder: {
    color: '#999',
  },
  icon: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalButtonConfirm: {
    color: '#007AFF',
    fontWeight: '600',
  },
  pickerContainer: {
    paddingVertical: 10,
  },
});

