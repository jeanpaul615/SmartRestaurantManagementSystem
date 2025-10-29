"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ordersApi } from "@/lib/api"; // ← lib/api.ts

/**
 * 🎯 EJEMPLO: Usando AMBOS en el mismo componente
 * 
 * - API Routes: Para checkout con Stripe (secrets)
 * - lib/api.ts: Para operaciones normales de órdenes
 */
export default function CheckoutPage() {
  const { data: session } = useSession();
  const [processing, setProcessing] = useState(false);

  // ✅ OPCIÓN 1: Usar lib/api.ts para obtener órdenes
  // (operación normal, sin secrets)
  const handleGetOrders = async () => {
    try {
      const orders = await ordersApi.getAll(session?.user?.accessToken!);
      console.log("Órdenes obtenidas:", orders);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ OPCIÓN 2: Usar API Route para procesar pago
  // (requiere secret key de Stripe)
  const handleCheckout = async () => {
    setProcessing(true);

    try {
      // 1. Llamar a API Route de Next.js
      // Esta ruta tiene acceso a STRIPE_SECRET_KEY
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: 123,
          amount: 5000, // $50.00
          currency: "usd",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar pago");
      }

      const { clientSecret } = await response.json();

      // 2. Usar el clientSecret con Stripe.js
      console.log("Pago iniciado:", clientSecret);
      alert("✅ Pago procesado exitosamente!");

      // 3. Después del pago, actualizar orden usando lib/api.ts
      await ordersApi.update(
        123,
        { status: "paid" },
        session?.user?.accessToken!
      );

      alert("✅ Orden actualizada!");
    } catch (error) {
      alert("❌ Error en el checkout");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ OPCIÓN 3: Usar lib/api.ts para crear orden
  // (operación normal)
  const handleCreateOrder = async () => {
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
        session?.user?.accessToken!
      );

      console.log("Orden creada:", newOrder);
      alert("✅ Orden creada!");
    } catch (error) {
      alert("❌ Error al crear orden");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Ejemplo: Usando API Routes + lib/api.ts
        </h1>

        {/* Explicación */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-bold text-blue-900 mb-3">
            🎯 Este componente usa AMBOS:
          </h2>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <div>
                <span className="font-semibold">lib/api.ts</span> para obtener
                y crear órdenes
                <br />
                <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                  ordersApi.getAll()
                </code>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <div>
                <span className="font-semibold">API Route</span> para procesar
                pagos (Stripe secret)
                <br />
                <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                  fetch('/api/payments/create')
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de ejemplo */}
        <div className="grid gap-4">
          {/* Operación con lib/api.ts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-2">
              📋 Operación normal (lib/api.ts)
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Consulta simple al backend NestJS
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleGetOrders}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Ver Órdenes
              </button>
              <button
                onClick={handleCreateOrder}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Crear Orden
              </button>
            </div>
          </div>

          {/* Operación con API Route */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-2">
              💳 Operación sensible (API Route)
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Requiere secret key de Stripe (seguro en servidor)
            </p>
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {processing ? "Procesando..." : "💳 Procesar Pago ($50.00)"}
            </button>
          </div>
        </div>

        {/* Diagrama de flujo */}
        <div className="bg-gray-100 rounded-xl p-6 mt-8">
          <h3 className="font-bold text-gray-900 mb-3">🔄 Flujo completo:</h3>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">
            {`1. Ver Órdenes:
   Componente → lib/api.ts → Backend NestJS → PostgreSQL

2. Crear Orden:
   Componente → lib/api.ts → Backend NestJS → PostgreSQL

3. Procesar Pago:
   Componente → API Route (/api/payments/create)
              → API Route usa STRIPE_SECRET_KEY
              → Stripe API
              → Retorna al componente
              → Componente → lib/api.ts → Actualiza orden`}
          </pre>
        </div>
      </div>
    </div>
  );
}
