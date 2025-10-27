import { useState } from 'react';
import { useAppState } from '../../context/GlobalStateContext';
import { login as authLogin } from '../../services/AuthService';
import './Login.css';

/**
 * Componente de Login
 * Permite a los usuarios autenticarse en el sistema
 */
const Login = () => {
  const { dispatch } = useAppState();
  
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Maneja el envío del formulario de login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpia errores previos
    setError('');
    setLoading(true);

    try {
      // Llama al servicio de autenticación
      const userObject = await authLogin(email, password);
      
      // Despacha la acción para establecer el usuario actual
      dispatch({
        type: 'SET_CURRENT_USER',
        payload: userObject
      });
      
      // Opcional: Limpiar el formulario
      setEmail('');
      setPassword('');
    } catch (err) {
      // Maneja errores de autenticación
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rellena el formulario con credenciales de prueba
   */
  const fillTestCredentials = (testEmail) => {
    setEmail(testEmail);
    setPassword('123');
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Marketplace de Servicios</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="test-credentials">
          <p className="test-title">Usuarios de Prueba:</p>
          <div className="test-buttons">
            <button
              type="button"
              onClick={() => fillTestCredentials('solicitante@mail.com')}
              className="btn-test btn-solicitante"
              disabled={loading}
            >
              Solicitante
            </button>
            <button
              type="button"
              onClick={() => fillTestCredentials('servicio@mail.com')}
              className="btn-test btn-proveedor-servicio"
              disabled={loading}
            >
              Proveedor Servicio
            </button>
            <button
              type="button"
              onClick={() => fillTestCredentials('insumos@mail.com')}
              className="btn-test btn-proveedor-insumos"
              disabled={loading}
            >
              Proveedor Insumos
            </button>
          </div>
          <p className="test-hint">Contraseña para todos: <strong>123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

