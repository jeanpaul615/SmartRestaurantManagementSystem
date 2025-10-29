/**
 * 🔌 API CLIENT - Comunicación con el backend NestJS
 * 
 * Este archivo centraliza todas las llamadas al backend.
 * Usa fetch() o axios para hacer peticiones HTTP.
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// ========================================
// 🔧 FUNCIONES HELPER
// ========================================

/**
 * Obtiene los headers con el token de autenticación
 */
function getAuthHeaders(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Maneja errores de la API
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ========================================
// 🔐 AUTENTICACIÓN
// ========================================

export const authApi = {
  /**
   * Login con email y contraseña
   */
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Refrescar el access token
   */
  async refreshToken(refreshToken: string) {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Logout
   */
  async logout(token: string) {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// ========================================
// 🍽️ ORDERS (ÓRDENES)
// ========================================

export const ordersApi = {
  /**
   * Obtener todas las órdenes
   */
  async getAll(token: string) {
    const response = await fetch(`${API_URL}/api/orders`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Order[]>(response);
  },

  /**
   * Obtener una orden por ID
   */
  async getById(id: number, token: string) {
    const response = await fetch(`${API_URL}/api/orders/${id}`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Order>(response);
  },

  /**
   * Crear nueva orden
   */
  async create(data: CreateOrderDto, token: string) {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(response);
  },

  /**
   * Actualizar orden
   */
  async update(id: number, data: UpdateOrderDto, token: string) {
    const response = await fetch(`${API_URL}/api/orders/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse<Order>(response);
  },

  /**
   * Eliminar orden
   */
  async delete(id: number, token: string) {
    const response = await fetch(`${API_URL}/api/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return handleResponse<void>(response);
  },

  /**
   * Obtener órdenes por restaurante
   */
  async getByRestaurant(restaurantId: number, token: string) {
    const response = await fetch(`${API_URL}/api/orders/restaurant/${restaurantId}`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Order[]>(response);
  },
};

// ========================================
// 🍕 PRODUCTS (PRODUCTOS/MENÚ)
// ========================================

export const productsApi = {
  /**
   * Obtener todos los productos (público)
   */
  async getAll() {
    const response = await fetch(`${API_URL}/api/products`);
    return handleResponse<Product[]>(response);
  },

  /**
   * Obtener producto por ID
   */
  async getById(id: number) {
    const response = await fetch(`${API_URL}/api/products/${id}`);
    return handleResponse<Product>(response);
  },

  /**
   * Crear producto (solo admin)
   */
  async create(data: CreateProductDto, token: string) {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  /**
   * Actualizar producto
   */
  async update(id: number, data: UpdateProductDto, token: string) {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  /**
   * Actualizar stock
   */
  async updateStock(id: number, stock: number, token: string) {
    const response = await fetch(`${API_URL}/api/products/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ stock }),
    });
    return handleResponse<Product>(response);
  },
};

// ========================================
// 📅 RESERVATIONS (RESERVACIONES)
// ========================================

export const reservationsApi = {
  /**
   * Crear reservación
   */
  async create(data: CreateReservationDto, token: string) {
    const response = await fetch(`${API_URL}/api/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse<Reservation>(response);
  },

  /**
   * Obtener mis reservaciones
   */
  async getMine(token: string) {
    const response = await fetch(`${API_URL}/api/reservations/my-reservations`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Reservation[]>(response);
  },

  /**
   * Confirmar reservación
   */
  async confirm(id: number, token: string) {
    const response = await fetch(`${API_URL}/api/reservations/${id}/confirm`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    return handleResponse<Reservation>(response);
  },

  /**
   * Cancelar reservación
   */
  async cancel(id: number, token: string) {
    const response = await fetch(`${API_URL}/api/reservations/${id}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    return handleResponse<Reservation>(response);
  },
};

// ========================================
// 🔔 NOTIFICATIONS (NOTIFICACIONES)
// ========================================

export const notificationsApi = {
  /**
   * Obtener mis notificaciones
   */
  async getMine(token: string) {
    const response = await fetch(`${API_URL}/api/notifications/my-notifications`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Notification[]>(response);
  },

  /**
   * Obtener notificaciones no leídas
   */
  async getUnread(token: string) {
    const response = await fetch(`${API_URL}/api/notifications/my-notifications/unread`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Notification[]>(response);
  },

  /**
   * Marcar como leída
   */
  async markAsRead(id: number, token: string) {
    const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    return handleResponse<Notification>(response);
  },

  /**
   * Marcar todas como leídas
   */
  async markAllAsRead(token: string) {
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
    });
    return handleResponse<{ message: string }>(response);
  },
};

// ========================================
// 👤 USERS (USUARIOS)
// ========================================

export const usersApi = {
  /**
   * Obtener todos los usuarios (admin)
   */
  async getAll(token: string) {
    const response = await fetch(`${API_URL}/api/users`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<User[]>(response);
  },

  /**
   * Obtener mi perfil
   */
  async getProfile(token: string) {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<User>(response);
  },

  /**
   * Actualizar perfil
   */
  async updateProfile(data: UpdateUserDto, token: string) {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },
};

// ========================================
// 🏪 RESTAURANTS (RESTAURANTES)
// ========================================

export const restaurantsApi = {
  /**
   * Obtener todos los restaurantes (público)
   */
  async getAll() {
    const response = await fetch(`${API_URL}/api/restaurant`);
    return handleResponse<Restaurant[]>(response);
  },

  /**
   * Obtener restaurante por ID
   */
  async getById(id: number) {
    const response = await fetch(`${API_URL}/api/restaurant/${id}`);
    return handleResponse<Restaurant>(response);
  },
};

// ========================================
// 📝 TIPOS DE DATOS
// ========================================

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

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface Order {
  id: number;
  status: string;
  total_price: number;
  order_date: string;
  restaurant_id: number;
  table_id: number;
  user_id: number;
}

export interface CreateOrderDto {
  restaurant_id: number;
  table_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface UpdateOrderDto {
  status?: string;
  total_price?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  restaurant_id: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  restaurant_id: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

export interface Reservation {
  id: number;
  reservation_date: string;
  number_people: number;
  status: string;
  user_id: number;
  restaurant_id: number;
  table_id: number;
}

export interface CreateReservationDto {
  reservation_date: string;
  number_people: number;
  restaurant_id: number;
  table_id: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  user_id: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  description: string;
  user_id: number;
}
