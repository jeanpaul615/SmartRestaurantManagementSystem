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

// ⚠️ Nueva respuesta sin tokens (van en cookies)
export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  message: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// 💾 Estado en memoria para el usuario actual
let currentUser: User | null = null;

// ========================================
// 🔧 SERVICIO DE AUTENTICACIÓN
// ========================================

export const authService = {
  /**
   * 🔑 LOGIN - Iniciar sesión
   * Los tokens ahora se envían automáticamente en cookies HttpOnly
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    
    // 💾 Guardar usuario en memoria
    currentUser = response.data.user;
    
    // 💾 También en sessionStorage para persistir entre reloads (opcional)
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  /**
   * 📝 REGISTER - Registrar nuevo usuario
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
    
    // 💾 Guardar usuario en memoria
    currentUser = response.data.user;
    
    // 💾 También en sessionStorage
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  /**
   * 🔄 REFRESH - Refrescar access token
   * El refresh token se envía automáticamente en cookies
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/refresh', {});
    
    // 💾 Actualizar usuario en memoria
    currentUser = response.data.user;
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  /**
   * 🚪 LOGOUT - Cerrar sesión
   */
  logout: async (): Promise<void> => {
    try {
      // Llamar al endpoint de logout (limpia las cookies en el backend)
      await axiosInstance.post('/auth/logout', {});
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpiar estado en memoria y sessionStorage
      currentUser = null;
      sessionStorage.removeItem('user');
    }
  },

  /**
   * 👤 GET CURRENT USER - Obtener usuario actual desde memoria o sessionStorage
   */
  getCurrentUser: (): User | null => {
    // Primero intentar desde memoria
    if (currentUser) return currentUser;
    
    // Si no está en memoria, intentar desde sessionStorage
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      currentUser = JSON.parse(userStr);
      return currentUser;
    } catch {
      return null;
    }
  },

  /**
   * � SET CURRENT USER - Establecer usuario actual (útil después de refresh)
   */
  setCurrentUser: (user: User | null): void => {
    currentUser = user;
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  },

  /**
   * ✅ IS AUTHENTICATED - Verificar si el usuario está autenticado
   * Ahora verificamos si hay un usuario en memoria/sessionStorage
   */
  isAuthenticated: (): boolean => {
    return !!authService.getCurrentUser();
  },

  /**
   * 🔐 GET ACCESS TOKEN - Ya NO se usa porque el token va en cookies
   * @deprecated Los tokens ahora se manejan automáticamente en cookies HttpOnly
   */
  getAccessToken: (): null => {
    console.warn('getAccessToken() is deprecated. Tokens are now in HttpOnly cookies.');
    return null;
  },
};