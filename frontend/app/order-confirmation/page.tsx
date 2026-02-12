'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const number = searchParams.get('orderNumber');
    if (!number) {
      // Si no hay número de orden, redirigir a inicio
      router.push('/');
    } else {
      setOrderNumber(number);
    }
  }, [searchParams, router]);

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icono de éxito */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✓</span>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pedido Realizado con Éxito!
          </h1>

          {/* Mensaje */}
          <p className="text-gray-600 mb-8">
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
          </p>

          {/* Número de orden */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Número de Orden</p>
            <p className="text-2xl font-bold text-indigo-600">{orderNumber}</p>
          </div>

          {/* Información adicional */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold text-gray-900">
                  Confirmación enviada
                </p>
                <p className="text-sm text-gray-600">
                  Hemos enviado un email con los detalles de tu pedido
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-gray-900">
                  Preparando tu pedido
                </p>
                <p className="text-sm text-gray-600">
                  Te notificaremos cuando tu pedido esté en camino
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-semibold text-gray-900">
                  Envío gratis
                </p>
                <p className="text-sm text-gray-600">
                  Recibirás tu pedido en 3-5 días hábiles
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
            >
              Seguir Comprando
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}