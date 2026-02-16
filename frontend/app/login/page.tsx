'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { isValidEmail } from '@/lib/utils/validation';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpiar error del campo al escribir
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      delete newErrors.general;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar que no esté vacío
    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email o usuario es requerido';
    } else {
      // Si parece un email, validar formato
      if (formData.identifier.includes('@')) {
        if (!isValidEmail(formData.identifier)) {
          newErrors.identifier = 'Formato de email inválido';
        }
      } else {
        // Si es username, validar longitud mínima
        if (formData.identifier.length < 3) {
          newErrors.identifier = 'Usuario debe tener al menos 3 caracteres';
        }
      }
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si está bloqueado por intentos fallidos
    if (isBlocked) {
      setErrors({
        general: 'Demasiados intentos fallidos. Espera 5 minutos.',
      });
      return;
    }

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login({
        identifier: formData.identifier.trim().toLowerCase(),
        password: formData.password,
      });
      
      // Resetear intentos en login exitoso
      setLoginAttempts(0);
      
      // La redirección se maneja en AuthContext
    } catch (err: any) {
      // Incrementar intentos fallidos
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Bloquear después de 5 intentos
      if (newAttempts >= 5) {
        setIsBlocked(true);
        setErrors({
          general: 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente por 5 minutos.',
        });
        
        // Desbloquear después de 5 minutos
        setTimeout(() => {
          setIsBlocked(false);
          setLoginAttempts(0);
        }, 5 * 60 * 1000); // 5 minutos
      } else {
        // Mostrar mensaje de error con intentos restantes
        const remainingAttempts = 5 - newAttempts;
        setErrors({
          general: `Usuario o contraseña incorrectos. Intentos restantes: ${remainingAttempts}`,
        });
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600">
              Accede a tu cuenta de E-Shop
            </p>
          </div>

          {/* Mensaje de advertencia si hay intentos fallidos */}
          {loginAttempts > 0 && loginAttempts < 5 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>Intentos fallidos: {loginAttempts}/5</span>
              </p>
            </div>
          )}

          {/* Mensaje de error */}
          {errors.general && (
            <div className={`mb-6 border px-4 py-3 rounded-lg ${
              isBlocked 
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <p className="text-sm flex items-center gap-2">
                <span>{isBlocked ? '🚫' : '❌'}</span>
                <span>{errors.general}</span>
              </p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email o Username */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Email o Usuario
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                autoComplete="username"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.identifier ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="tu@email.com o usuario123"
                disabled={isLoading || isBlocked}
              />
              {errors.identifier && (
                <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading || isBlocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                  disabled={isBlocked}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Recordar y olvidé contraseña */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isBlocked}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  href="/forgot-password" 
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isLoading || isBlocked}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
                isLoading || isBlocked
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Iniciando sesión...
                </span>
              ) : isBlocked ? (
                <span className="flex items-center justify-center gap-2">
                  <span>🚫</span>
                  Bloqueado temporalmente
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Información de seguridad */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 flex items-start gap-2">
              <span className="text-sm">🔒</span>
              <span>
                Tu información está protegida con encriptación SSL. 
                Nunca compartimos tus datos con terceros.
              </span>
            </p>
          </div>

          {/* Divisor */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>
          </div>

          {/* Botones sociales (placeholder) */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled
            >
              <span className="mr-2">🔵</span>
              Facebook
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled
            >
              <span className="mr-2">🔴</span>
              Google
            </button>
          </div>

          {/* Link a registro */}
          <p className="mt-6 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Volver a inicio */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}