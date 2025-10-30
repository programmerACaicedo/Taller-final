import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const { login, register, isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegisterMode) {
        await register(formData.username, formData.password);
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        setIsRegisterMode(false);
        setFormData({ username: '', password: '' });
      } else {
        await login(formData.username, formData.password);
        // El redireccionamiento se manejará automáticamente por el estado de autenticación
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error en la operación';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card space-y-6">
        <div>
          <h2 className="login-title">
            {isRegisterMode ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="login-subtitle">
            PathFinder - Explorador de Grafos
          </p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="input"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Procesando...' : (isRegisterMode ? 'Registrarse' : 'Iniciar sesión')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setFormData({ username: '', password: '' });
              }}
              className="link"
            >
              {isRegisterMode 
                ? '¿Ya tienes cuenta? Iniciar sesión' 
                : '¿No tienes cuenta? Registrarse'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;