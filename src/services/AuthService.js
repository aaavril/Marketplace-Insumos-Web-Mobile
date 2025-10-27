import { MOCK_USERS } from '../data/initialState';

/**
 * Servicio de Autenticación
 * Maneja la lógica de negocio para el login basada en usuarios mock
 */

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
      // Busca el usuario por email
      const user = MOCK_USERS.find(u => u.email === email);

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

