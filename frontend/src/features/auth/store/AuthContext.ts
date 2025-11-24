// frontend/src/features/auth/store/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type User, type LoginCredentials, type RegisterData } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// ========================================
// 📦 INTERFACES
// ========================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// ========================================
// 🏗️ CREAR CONTEXTO
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// 🎯 PROVIDER
// ========================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Cargar usuario al iniciar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ========================================
  // 🔑 LOGIN
  // ========================================
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      
      toast.success(`¡Bienvenido, ${response.user.username}!`);
      
      // Redirigir al dashboard principal
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // 📝 REGISTER
  // ========================================
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      setUser(response.user);
      
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/menu');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // 🚪 LOGOUT
  // ========================================
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      toast.info('Sesión cerrada correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // 🔄 REFRESH AUTH
  // ========================================
  const refreshAuth = async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await logout();
    }
  };

  // ========================================
  // 📤 PROVIDER VALUE
  // ========================================
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

// ========================================
// 🪝 CUSTOM HOOK
// ========================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};