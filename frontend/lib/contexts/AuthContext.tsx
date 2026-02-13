'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, getCurrentUser } from '@/lib/api';
import type { User, AuthResponse, RegisterData, LoginData } from '@/types/auth';

// ============================================================
// Tipos
// ============================================================
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// ============================================================
// Crear el Context
// ============================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Provider del Auth
// ============================================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ============================================================
  // Cargar usuario desde localStorage al inicio
  // ============================================================
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');

      if (savedToken && savedUser) {
        try {
          // Verificar que el token sigue válido
          const currentUser = await getCurrentUser(savedToken);
          setToken(savedToken);
          setUser(currentUser);
        } catch (error) {
          // Token inválido o expirado
          console.error('Token inválido:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // ============================================================
  // Función de Login
  // ============================================================
  const login = async (data: LoginData) => {
    try {
      const response: AuthResponse = await loginUser(data);
      
      // Guardar en estado
      setToken(response.jwt);
      setUser(response.user);

      // Guardar en localStorage
      localStorage.setItem('auth_token', response.jwt);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      // Redirigir a home
      router.push('/');
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  };

  // ============================================================
  // Función de Registro
  // ============================================================
  const register = async (data: RegisterData) => {
    try {
      const response: AuthResponse = await registerUser(data);
      
      // Guardar en estado
      setToken(response.jwt);
      setUser(response.user);

      // Guardar en localStorage
      localStorage.setItem('auth_token', response.jwt);
      localStorage.setItem('auth_user', JSON.stringify(response.user));

      // Redirigir a home
      router.push('/');
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al registrarse');
    }
  };

  // ============================================================
  // Función de Logout
  // ============================================================
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/');
  };

  // ============================================================
  // Valor del contexto
  // ============================================================
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================
// Hook personalizado
// ============================================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}