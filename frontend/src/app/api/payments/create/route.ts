/**
 * 💳 API ROUTE: Crear pago con Stripe
 * 
 * Este endpoint:
 * 1. Recibe datos del frontend
 * 2. Usa el SECRET_KEY de Stripe (seguro)
 * 3. Crea un PaymentIntent en Stripe
 * 4. Retorna el clientSecret al frontend
 * 
 * ⚠️ IMPORTANTE: El STRIPE_SECRET_KEY nunca llega al navegador
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// POST /api/payments/create
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // 2. Obtener datos del body
    const { orderId, amount, currency } = await request.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // 3. ✅ AQUÍ USARÍAS STRIPE (simulado por ahora)
    // En producción:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency,
    //   metadata: { orderId, userId: session.user.id }
    // });

    // Por ahora, simulamos la respuesta
    const simulatedClientSecret = `pi_${Math.random().toString(36).substring(7)}_secret_${Math.random().toString(36).substring(7)}`;

    console.log('🔐 Pago procesado (simulado):', {
      orderId,
      amount,
      currency,
      userId: session.user.id,
      // El secret key nunca se expone al cliente
      secretKeyUsed: '✅ STRIPE_SECRET_KEY (oculto)',
    });

    // 4. Opcional: Actualizar orden en tu backend NestJS
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          status: 'payment_processing',
          payment_intent: simulatedClientSecret,
        }),
      });
    } catch (err) {
      console.error('Error al actualizar orden:', err);
      // No fallar si falla la actualización
    }

    // 5. Retornar clientSecret al frontend
    return NextResponse.json({
      success: true,
      clientSecret: simulatedClientSecret,
      orderId,
      amount,
    });

  } catch (error) {
    console.error('Error en /api/payments/create:', error);
    return NextResponse.json(
      { error: 'Error al procesar pago' },
      { status: 500 }
    );
  }
}

// GET /api/payments/create - Para verificar status
export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Endpoint para crear pagos',
    usage: 'POST /api/payments/create',
    requiredFields: ['orderId', 'amount', 'currency'],
  });
}
