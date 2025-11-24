// frontend/src/features/auth/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import Bg_Login from '../../../assets/Bg.jpg';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Usar el login del contexto de autenticación
      await authLogin({ email, password });
      
      // Mostrar mensaje de éxito
      setSuccessMessage('¡Login exitoso! Redirigiendo al dashboard...');
      
      // El AuthContext manejará la redirección
    } catch (err: any) {
      console.error('❌ Error en login:', err);
      
      // Mejorar el manejo de errores con mensajes específicos
      let errorMessage = 'Error al iniciar sesión';
      
      if (err.response) {
        // El servidor respondió con un código de error
        const status = err.response.status;
        const serverMessage = err.response.data?.message;
        
        switch (status) {
          case 401:
            errorMessage = 'Email o contraseña incorrectos. Por favor verifica tus credenciales.';
            break;
          case 403:
            errorMessage = 'Acceso denegado. Tu cuenta puede estar inactiva.';
            break;
          case 404:
            errorMessage = 'Servicio no encontrado. Verifica que el backend esté corriendo.';
            break;
          case 500:
            errorMessage = 'Error en el servidor. Por favor intenta más tarde.';
            break;
          default:
            errorMessage = serverMessage || `Error ${status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión y que el backend esté corriendo en http://localhost:8000';
      } else {
        // Otro tipo de error
        errorMessage = err.message || 'Error desconocido al iniciar sesión';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden">

      {/* Header fijo - Solo desktop */}
      <header className="hidden lg:flex fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md px-6 md:px-12 py-4 md:py-6 justify-center items-center shadow-lg z-50">
        <h1 className="text-2xl md:text-3xl xl:text-4xl font-black tracking-tighter text-gray-900 hover:scale-105 transition-all duration-300">
          SmartRestaurant
        </h1>
        <div className="h-6 md:h-8 border-l-2 border-gray-300 ml-3 md:ml-4"></div>
      </header>

      {/* Lado izquierdo con imagen */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 min-h-screen relative">
        <img
          className="w-full h-full object-cover opacity-70"
          src={Bg_Login}
          alt="bg-login"
        />
        {/* Texto sobrepuesto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-br from-black/60 via-black/50 to-transparent backdrop-blur-sm p-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
              Excelencia en Gestión Gastronómica
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-100 font-light">
              Plataforma inteligente para la administración de múltiples restaurantes. 
              Control total, insights en tiempo real, operación optimizada.
            </p>
            <div className="mt-6 md:mt-10 flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Multi-restaurante</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Tiempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Analytics IA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Login */}
      <div className="w-full lg:w-1/2 xl:w-2/5 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-8 lg:py-12">
        <div className="w-full max-w-md px-6 sm:px-8">
          
          {/* Logo móvil */}
          <div className="lg:hidden mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900">SmartRestaurant</h1>
          </div>

          {/* Título */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-sm sm:text-base text-gray-600">Ingresa tus credenciales para acceder</p>
          </div>

          {/* Mensaje de error mejorado */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">Error al iniciar sesión</h3>
                  <p className="text-sm text-red-700">{error}</p>
                  {error.includes('backend') && (
                    <div className="mt-2 text-xs text-red-600 bg-red-100 rounded p-2">
                      <p className="font-semibold mb-1">💡 Soluciones posibles:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Verifica que el backend esté corriendo</li>
                        <li>Ejecuta: <code className="bg-red-200 px-1 rounded">cd backend && npm run start:dev</code></li>
                        <li>Verifica que el puerto 8000 esté disponible</li>
                      </ul>
                    </div>
                  )}
                  {error.includes('incorrectos') && (
                    <div className="mt-2 text-xs text-red-600 bg-red-100 rounded p-2">
                      <p className="font-semibold mb-1">💡 ¿Necesitas ayuda?</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Verifica que el email esté escrito correctamente</li>
                        <li>Asegúrate de que la contraseña sea la correcta</li>
                        <li>Si no tienes cuenta, regístrate primero</li>
                      </ul>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setError('')}
                  className="flex-shrink-0 text-red-400 hover:text-red-600 transition"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-green-800 mb-1">¡Éxito!</h3>
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Recordar / Olvidé contraseña */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 text-gray-900 rounded focus:ring-2 focus:ring-gray-900" />
                <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition">Recordarme</span>
              </label>
              <a href="#" className="text-gray-900 hover:text-gray-700 font-medium transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Registro */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a href="/register" className="text-gray-900 hover:text-gray-700 font-semibold transition">
                Regístrate aquí
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              © 2025 SmartRestaurant. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
