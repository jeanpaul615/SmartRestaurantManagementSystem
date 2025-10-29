"use client";

import { useState, useEffect } from "react";

/**
 * 📊 EJEMPLO: Usando API Route como PROXY
 * 
 * Flujo:
 * 1. Componente (navegador) → llama a API Route de Next.js
 * 2. API Route (servidor Next.js) → llama a backend NestJS
 * 3. Backend NestJS → retorna datos
 * 4. API Route → retorna al componente
 * 
 * Ventajas:
 * - Token nunca se expone al navegador
 * - Backend real está oculto
 * - Puedes agregar caché, validación, etc.
 */
export default function OrdersProxyPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        
        // ✅ Llamada a la API Route de Next.js (no directamente a NestJS)
        const response = await fetch('/api/proxy/orders');
        
        if (!response.ok) {
          throw new Error('Error al cargar órdenes');
        }
        
        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

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
        <div className="bg-red-50 text-red-600 p-6 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Órdenes (usando API Route Proxy)
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="font-bold text-blue-900 mb-2">ℹ️ Cómo funciona:</h2>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Este componente llama a: <code>/api/proxy/orders</code></li>
            <li>2. El API Route (servidor Next.js) llama a: <code>http://localhost:8000/api/orders</code></li>
            <li>3. El token se mantiene seguro en el servidor</li>
            <li>4. El navegador nunca ve el token real</li>
          </ol>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No hay órdenes</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Orden #{order.id}
                    </h3>
                    <p className="text-gray-600">Estado: {order.status}</p>
                    <p className="text-gray-600">
                      Total: ${order.total_price?.toFixed(2)}
                    </p>
                    {order.isRecent && (
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        ✨ Reciente (menos de 24h)
                      </span>
                    )}
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
