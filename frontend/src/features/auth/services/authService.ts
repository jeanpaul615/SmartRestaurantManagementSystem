// frontend/src/features/auth/services/authService.ts

import { axiosInstance } from '@/core/api/axiosInstance';

// ========================================
// 📦 INTERFACES / TYPES
// ========================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'customer' | 'admin' | 'waiter' | 'chef';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// ========================================
// 🔧 SERVICIO DE AUTENTICACIÓN
// ========================================

export const authService = {
  /**
   * 🔑 LOGIN - Iniciar sesión
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    
    // Guardar tokens en localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * 📝 REGISTER - Registrar nuevo usuario
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    
    // Guardar tokens en localStorage
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * 🔄 REFRESH - Refrescar access token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refresh_token = localStorage.getItem('refresh_token');
    
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
    
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh', {
      refresh_token
    });
    
    // Actualizar tokens
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  /**
   * 🚪 LOGOUT - Cerrar sesión
   */
  logout: async (): Promise<void> => {
    const refresh_token = localStorage.getItem('refresh_token');
    
    try {
      // Llamar al endpoint de logout del backend
      await axiosInstance.post('/auth/logout', { refresh_token });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Siempre limpiar el localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * ✅ VALIDATE TOKEN - Validar si el token es válido
   */
  validateToken: async (token: string): Promise<{ valid: boolean; user: User }> => {
    const response = await axiosInstance.post('/auth/validate', { token });
    return response.data;
  },

  /**
   * 👤 GET CURRENT USER - Obtener usuario actual desde localStorage
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * 🔐 GET ACCESS TOKEN
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  /**
   * ✅ IS AUTHENTICATED - Verificar si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};