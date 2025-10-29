"use client";

import { useOrders } from "@/hooks/useApi";
import { useState } from "react";

/**
 * 📋 EJEMPLO: Usando el hook useOrders
 * 
 * Este componente es mucho más simple porque
 * el hook encapsula toda la lógica de fetch
 */
export default function OrdersSimplePage() {
  const { orders, loading, error, createOrder, deleteOrder, refetch } = useOrders();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // 📝 Formulario para nueva orden
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await createOrder({
        restaurant_id: 1,
        table_id: 5,
        items: [
          { product_id: 1, quantity: 2 },
          { product_id: 3, quantity: 1 },
        ],
      });
      
      alert("✅ Orden creada exitosamente!");
      setShowCreateForm(false);
    } catch (err) {
      alert("❌ Error al crear orden");
    }
  };

  // 🗑️ Eliminar orden
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta orden?")) return;
    
    try {
      await deleteOrder(id);
      alert("✅ Orden eliminada");
    } catch (err) {
      alert("❌ Error al eliminar");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
          <button
            onClick={refetch}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mis Órdenes ({orders.length})</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            + Nueva Orden
          </button>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Orden</h2>
            <form onSubmit={handleSubmit}>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Crear Orden
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="ml-2 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </form>
          </div>
        )}

        {/* Lista de órdenes */}
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-bold">Orden #{order.id}</h3>
                  <p>Estado: {order.status}</p>
                  <p>Total: ${order.total_price}</p>
                </div>
                <button
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
