"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ordersApi, Order } from "@/lib/api";

/**
 * 📋 EJEMPLO: Página de órdenes
 * 
 * Este componente muestra cómo:
 * 1. Obtener el token de la sesión
 * 2. Hacer peticiones al backend
 * 3. Manejar estados de carga y errores
 */
export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Obtener órdenes cuando el componente se monta
  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.accessToken) {
        setError("No hay sesión activa");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // ✅ Llamada al backend usando el API client
        const data = await ordersApi.getAll(session.user.accessToken);
        
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar órdenes");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session]);

  // 🔄 Crear nueva orden
  const handleCreateOrder = async () => {
    if (!session?.user?.accessToken) return;

    try {
      const newOrder = await ordersApi.create(
        {
          restaurant_id: 1,
          table_id: 5,
          items: [
            { product_id: 1, quantity: 2 },
            { product_id: 3, quantity: 1 },
          ],
        },
        session.user.accessToken
      );

      // Agregar la nueva orden a la lista
      setOrders([...orders, newOrder]);
      alert("Orden creada exitosamente!");
    } catch (err) {
      alert("Error al crear orden: " + (err as Error).message);
    }
  };

  // 🗑️ Eliminar orden
  const handleDeleteOrder = async (orderId: number) => {
    if (!session?.user?.accessToken) return;
    
    if (!confirm("¿Estás seguro de eliminar esta orden?")) return;

    try {
      await ordersApi.delete(orderId, session.user.accessToken);
      
      // Remover de la lista
      setOrders(orders.filter(order => order.id !== orderId));
      alert("Orden eliminada!");
    } catch (err) {
      alert("Error al eliminar: " + (err as Error).message);
    }
  };

  // 📊 UI States
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
          <button
            onClick={handleCreateOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
          >
            + Nueva Orden
          </button>
        </div>

        {/* Lista de órdenes */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No hay órdenes todavía</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Orden #{order.id}
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Estado:</span>{" "}
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Total:</span> $
                        {order.total_price.toFixed(2)}
                      </p>
                      <p>
                        <span className="font-medium">Fecha:</span>{" "}
                        {new Date(order.order_date).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Mesa:</span> #{order.table_id}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg transition duration-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
