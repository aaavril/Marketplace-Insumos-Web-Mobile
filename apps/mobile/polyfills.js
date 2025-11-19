/**
 * polyfills.js - POLYFILL DE LOCALSTORAGE PARA REACT NATIVE
 * 
 * React Native NO tiene localStorage nativo como los navegadores web.
 * Este archivo crea una implementación de localStorage que simula la API
 * pero almacena los datos en memoria (no en el sistema de archivos).
 * 
 * ¿Por qué necesitamos esto?
 * - El código compartido (packages/core-logic) usa localStorage para persistir datos
 * - AuthContext y otros servicios usan localStorage para guardar el usuario
 * - Sin este polyfill, la app mobile fallaría al intentar usar localStorage
 * 
 * IMPORTANTE: Limitaciones
 * - Los datos se almacenan en MEMORIA, no en el sistema de archivos
 * - Los datos se PIERDEN cuando cierras la app
 * - No es persistente entre sesiones (a diferencia de web)
 * 
 * Para persistencia real en mobile, se debería usar:
 * - AsyncStorage (de @react-native-async-storage/async-storage)
 * - O expo-secure-store para datos sensibles
 * 
 * Este polyfill es suficiente para el MVP, pero en producción se debería
 * reemplazar con AsyncStorage para persistencia real.
 */

// Verifica si localStorage ya existe (no debería en React Native puro)
if (typeof localStorage === 'undefined') {
  // Objeto en memoria que simula el almacenamiento de localStorage
  const storage = {};
  
  /**
   * Crea un objeto global localStorage que simula la API del navegador
   * 
   * global.localStorage:
   * - Hace que localStorage esté disponible globalmente en toda la app
   * - Cualquier archivo puede usar localStorage.getItem(), localStorage.setItem(), etc.
   * - Implementa la misma API que localStorage del navegador
   */
  global.localStorage = {
    /**
     * Obtiene un valor del almacenamiento
     * @param {string} key - Clave del valor a obtener
     * @returns {string|null} - Valor almacenado o null si no existe
     */
    getItem: (key) => storage[key] || null,
    
    /**
     * Guarda un valor en el almacenamiento
     * @param {string} key - Clave del valor
     * @param {string} value - Valor a guardar (debe ser string)
     */
    setItem: (key, value) => { storage[key] = value; },
    
    /**
     * Elimina un valor del almacenamiento
     * @param {string} key - Clave del valor a eliminar
     */
    removeItem: (key) => { delete storage[key]; },
    
    /**
     * Limpia todo el almacenamiento
     */
    clear: () => { Object.keys(storage).forEach(key => delete storage[key]); },
    
    /**
     * Getter que retorna la cantidad de items almacenados
     * @returns {number} - Número de items en el almacenamiento
     */
    get length() { return Object.keys(storage).length; },
    
    /**
     * Obtiene la clave en un índice específico
     * @param {number} index - Índice de la clave
     * @returns {string|null} - Clave en ese índice o null si no existe
     */
    key: (index) => Object.keys(storage)[index] || null,
  };
}

