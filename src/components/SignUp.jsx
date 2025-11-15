import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppState } from '../context/GlobalStateContext';
import { saveRegisteredUser } from '../services/AuthService';
import './SignUp.css';

/**
 * Componente de SignUp (Registro)
 * Permite a los usuarios registrarse en el sistema
 */
const SignUp = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const { login } = useAuth();
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Solicitante');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Maneja el envío del formulario de registro
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      // Validar longitud mínima de contraseña
      if (password.length < 3) {
        setError('La contraseña debe tener al menos 3 caracteres');
        setLoading(false);
        return;
      }

      // Verificar si el email ya existe
      const existingUser = state.users.find(u => u.email === email);
      if (existingUser) {
        setError('Este email ya está registrado');
        setLoading(false);
        return;
      }

      // Crear el nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role
      };

      // Agregar el usuario al estado global (simulación de registro)
      dispatch({ type: 'ADD_USER', payload: newUser });
      
      // Guardar el usuario en localStorage para que AuthService pueda encontrarlo
      saveRegisteredUser(newUser);

      // Limpiar el formulario
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('Solicitante');

      // Hacer login automático después del registro
      await login(email, password);
      
      // Redirigir al dashboard después de registro exitoso
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al registrarse. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>MARKET DEL ESTE</h1>
          <p>Crea tu cuenta para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingresa tu nombre completo"
              required
              disabled={loading}
            />
          </div>

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
            <label htmlFor="role">Tipo de cuenta</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={loading}
              className="role-select"
            >
              <option value="Solicitante">Solicitante</option>
              <option value="Proveedor de Servicios">Proveedor de Servicios</option>
              <option value="Proveedor de Insumos">Proveedor de Insumos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 3 caracteres"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu contraseña"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-signup"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

