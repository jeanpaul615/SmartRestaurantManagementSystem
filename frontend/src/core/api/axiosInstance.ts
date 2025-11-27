// frontend/src/core/api/axiosInstance.ts (ACTUALIZACIÓN)

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🍪 IMPORTANTE: Habilitar envío de cookies
});

// ✅ Response Interceptor: Manejar errores y refresh automático
// 🍪 Ya NO necesitamos agregar el token manualmente - se envía en cookies
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Logging mejorado de errores
    if (error.response) {
      console.error('❌ Error del servidor:', {
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data?.message,
        url: originalRequest?.url,
      });
    } else if (error.request) {
      console.error('❌ Sin respuesta del servidor:', {
        message: 'No se pudo conectar con el backend',
        url: originalRequest?.url,
        baseURL: API_BASE_URL,
      });
    }

    // Si el error es 401 y no es un retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si ya estamos refrescando, esperar
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Ya no necesitamos pasar el token - va en cookies
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token (cookies se envían automáticamente)
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }, // Importante para enviar cookies
        );

        // Procesar cola de requests pendientes
        processQueue(null);

        isRefreshing = false;

        // Reintentar el request original (las nuevas cookies ya están configuradas)
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh falló, limpiar y redirigir
        processQueue(refreshError);
        isRefreshing = false;

        sessionStorage.clear();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
