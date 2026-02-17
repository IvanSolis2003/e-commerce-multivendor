'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getOrderByNumberWithAuth } from '@/lib/api';
import { formatPrice } from '@/lib/utils/format';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener el número de orden de los query params
  useEffect(() => {
    const number = searchParams.get('orderNumber');
    if (!number) {
      router.push('/');
    } else {
      setOrderNumber(number);
    }
  }, [searchParams, router]);

  // Cargar datos del pedido desde Strapi
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderNumber || !token || !isAuthenticated) return;

      try {
        const orderData = await getOrderByNumberWithAuth(orderNumber, token);
        if (orderData) {
          setOrder(orderData);
        }
      } catch (err) {
        console.error('Error al cargar orden:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber && token && isAuthenticated && !authLoading) {
      loadOrder();
    }
  }, [orderNumber, token, isAuthenticated, authLoading]);

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
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Icono de éxito */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">✓</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Pedido Realizado con Éxito!
            </h1>
            <p className="text-gray-600 text-lg">
              Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
            </p>
          </div>

          {/* Número de orden */}
          <div className="bg-indigo-50 rounded-lg p-6 mb-8 text-center">
            <p className="text-sm text-indigo-600 mb-1 font-medium">Número de Orden</p>
            <p className="text-2xl font-bold text-indigo-700">{orderNumber}</p>
          </div>

          {/* Datos del pedido (si se cargaron) */}
          {isLoading && !order ? (
            <div className="text-center py-4">
              <div className="animate-spin text-2xl mb-2">⏳</div>
              <p className="text-sm text-gray-500">Cargando detalles del pedido...</p>
            </div>
          ) : order ? (
            <div className="space-y-6 mb-8">
              {/* Resumen financiero */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>
                      {order.shippingCost === 0
                        ? '🎉 Gratis'
                        : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-indigo-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Método de Pago</h2>
                <p className="text-gray-700">
                  {order.paymentMethod === 'credit_card' && '💳 Tarjeta de Crédito'}
                  {order.paymentMethod === 'debit_card' && '💰 Tarjeta de Débito'}
                  {order.paymentMethod === 'cash_on_delivery' && '🏠 Pago Contra Entrega'}
                </p>
              </div>

              {/* Dirección de envío */}
              {order.shippingAddress && (
                <div className="bg-gray-50 rounded-lg p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Envío</h2>
                  <div className="text-gray-700 space-y-1">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}
                      {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                      {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
                    </p>
                    {order.shippingAddress.country && (
                      <p>{order.shippingAddress.country}</p>
                    )}
                    {order.shippingAddress.phone && (
                      <p className="text-sm text-gray-500 mt-2">📱 {order.shippingAddress.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Información de seguimiento */}
          <div className="space-y-4 mb-8 text-left border-t pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold text-gray-900">Confirmación enviada</p>
                <p className="text-sm text-gray-600">
                  Hemos enviado un email con los detalles de tu pedido
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-gray-900">Preparando tu pedido</p>
                <p className="text-sm text-gray-600">
                  Te notificaremos cuando tu pedido esté en camino
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-semibold text-gray-900">Entrega estimada</p>
                <p className="text-sm text-gray-600">
                  Recibirás tu pedido en 3-5 días hábiles
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/orders/${orderNumber}`}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
            >
              Ver Detalles del Pedido
            </Link>
            <Link
              href="/products"
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}