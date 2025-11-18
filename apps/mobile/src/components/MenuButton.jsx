import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

/**
 * MenuButton - Botón de menú hamburguesa
 * @param {Function} onPress - Función que se ejecuta al presionar
 */
export default function MenuButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.icon}>
        <View style={[styles.bar, styles.bar1]} />
        <View style={[styles.bar, styles.bar2]} />
        <View style={[styles.bar, styles.bar3]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  bar: {
    width: 24,
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  bar1: {
    marginBottom: 4,
  },
  bar2: {
    marginBottom: 4,
  },
  bar3: {},
});

