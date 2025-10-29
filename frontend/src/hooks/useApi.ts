/**
 * 🪝 CUSTOM HOOKS - Para facilitar las llamadas al backend
 * 
 * Estos hooks encapsulan la lógica de fetch y estados
 */

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// ========================================
// 🔧 HOOK GENÉRICO PARA FETCH
// ========================================

interface UseFetchOptions<T> {
  fetchFn: (token?: string) => Promise<T>;
  requiresAuth?: boolean;
  runOnMount?: boolean;
}

export function useFetch<T>(options: UseFetchOptions<T>) {
  const { data: session } = useSession();
  const { fetchFn, requiresAuth = false, runOnMount = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(runOnMount);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    if (requiresAuth && !session?.user?.accessToken) {
      setError("No hay sesión activa");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn(
        requiresAuth ? session?.user?.accessToken : undefined
      );

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (runOnMount) {
      execute();
    }
  }, [session?.user?.accessToken]);

  return { data, loading, error, refetch: execute };
}

// ========================================
// 🍽️ HOOK PARA ÓRDENES
// ========================================

export function useOrders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes
  const fetchOrders = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar órdenes");

      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Crear orden
  const createOrder = async (orderData: any) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) throw new Error("Error al crear orden");

      const newOrder = await response.json();
      setOrders([...orders, newOrder]);
      return newOrder;
    } catch (err) {
      throw err;
    }
  };

  // Actualizar orden
  const updateOrder = async (id: number, updates: any) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar orden");

      const updatedOrder = await response.json();
      setOrders(orders.map((o) => (o.id === id ? updatedOrder : o)));
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  };

  // Eliminar orden
  const deleteOrder = async (id: number) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar orden");

      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchOrders();
    }
  }, [session?.user?.accessToken]);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch: fetchOrders,
  };
}

// ========================================
// 🍕 HOOK PARA PRODUCTOS
// ========================================

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
      );

      if (!response.ok) throw new Error("Error al cargar productos");

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}

// ========================================
// 📅 HOOK PARA RESERVACIONES
// ========================================

export function useReservations() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservations/my-reservations`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar reservaciones");

      const data = await response.json();
      setReservations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: any) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!response.ok) throw new Error("Error al crear reservación");

      const newReservation = await response.json();
      setReservations([...reservations, newReservation]);
      return newReservation;
    } catch (err) {
      throw err;
    }
  };

  const confirmReservation = async (id: number) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservations/${id}/confirm`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al confirmar reservación");

      const updated = await response.json();
      setReservations(
        reservations.map((r) => (r.id === id ? updated : r))
      );
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const cancelReservation = async (id: number) => {
    if (!session?.user?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reservations/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cancelar reservación");

      const updated = await response.json();
      setReservations(
        reservations.map((r) => (r.id === id ? updated : r))
      );
      return updated;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchReservations();
    }
  }, [session?.user?.accessToken]);

  return {
    reservations,
    loading,
    error,
    createReservation,
    confirmReservation,
    cancelReservation,
    refetch: fetchReservations,
  };
}

// ========================================
// 🔔 HOOK PARA NOTIFICACIONES
// ========================================

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!session?.user?.accessToken) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/my-notifications`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar notificaciones");

      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    if (!session?.user?.accessToken) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(unreadCount - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    if (!session?.user?.accessToken) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchNotifications();
      
      // Actualizar cada 30 segundos
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session?.user?.accessToken]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}
