import { MOCK_USERS } from '../data/initialState';

/**
 * Servicio de Autenticación
 * Maneja la lógica de negocio para el login basada en usuarios mock y registrados
 */

/**
 * Obtiene todos los usuarios disponibles (mock + registrados)
 * @returns {Array} - Array de usuarios
 */
const getAllUsers = () => {
  // Obtener usuarios registrados del localStorage (si existen)
  try {
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    return [...MOCK_USERS, ...registeredUsers];
  } catch (error) {
    return MOCK_USERS;
  }
};

/**
 * Guarda un usuario registrado en localStorage
 * @param {Object} user - Usuario a guardar
 */
export const saveRegisteredUser = (user) => {
  try {
    const storedUsers = localStorage.getItem('registeredUsers');
    const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
    registeredUsers.push(user);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  } catch (error) {
    console.error('Error al guardar usuario:', error);
  }
};

/**
 * Realiza el login de un usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Promesa que resuelve con el objeto usuario completo
 * @throws {Error} - Si las credenciales son inválidas
 */
export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simula tiempo de carga de una llamada a API
    setTimeout(() => {
      // Busca el usuario por email en todos los usuarios disponibles
      const allUsers = getAllUsers();
      const user = allUsers.find(u => u.email === email);

      // Valida que el usuario exista
      if (!user) {
        reject(new Error('Credenciales inválidas'));
        return;
      }

      // Valida que la contraseña coincida (comparación estricta)
      if (user.password !== password) {
        reject(new Error('Credenciales inválidas'));
        return;
      }

      // Credenciales válidas - retorna el usuario completo (incluye role)
      resolve(user);
    }, 500); // Simula 500ms de latencia
  });
};

/**
 * Cierra la sesión del usuario
 * @returns {Promise<void>}
 */
export const logout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
};

