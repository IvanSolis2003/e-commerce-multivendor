'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getOrderByNumberWithAuth, getOrderItems } from '@/lib/api';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderItemsList } from '@/components/orders/OrderItemsList';
import { formatPrice } from '@/lib/utils/format';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener orderNumber de params
  useEffect(() => {
    params.then((p) => setOrderNumber(p.orderNumber));
  }, [params]);

  // Proteger la ruta
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar detalles de la orden
  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderNumber || !token || !isAuthenticated) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Cargar orden
        const orderData = await getOrderByNumberWithAuth(orderNumber, token);

        if (!orderData) {
          setError('Orden no encontrada o no tienes permiso para verla');
          setIsLoading(false);
          return;
        }

        setOrder(orderData);
        console.log('Orden cargada:', orderData);

        // Cargar items de la orden - Preferimos documentId en Strapi 5
        const orderIdentifier = orderData.documentId || orderData.id;
        console.log('Buscando items para orden:', orderIdentifier, 'con token:', !!token);

        const items = await getOrderItems(orderIdentifier, token);
        console.log('Items encontrados:', items);

        setOrderItems(items);
      } catch (err) {
        console.error('Error al cargar orden:', err);
        setError('Error al cargar los detalles de la orden');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber && token && isAuthenticated) {
      loadOrderDetails();
    }
  }, [orderNumber, token, isAuthenticated]);

  // Loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Cargando detalles del pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-red-700 mb-4">
              {error || 'Orden no encontrada'}
            </p>
            <Link
              href="/orders"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Volver a Mis Pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Inicio
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <Link href="/orders" className="text-gray-500 hover:text-gray-700">
            Mis Pedidos
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-900 font-medium">{order.orderNumber}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pedido #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Realizado el{' '}
                {new Date(order.createdAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <OrderStatusBadge status={order.orderStatus} size="lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Productos</h2>
              <OrderItemsList items={orderItems} />
            </div>

            {/* Información de envío */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Dirección de Envío
              </h2>
              <div className="text-gray-700 space-y-2">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <p className="text-sm">
                    📧 {order.shippingAddress.email}
                  </p>
                  <p className="text-sm">
                    📱 {order.shippingAddress.phone}
                  </p>
                </div>
                {order.shippingAddress.additionalInfo && (
                  <div className="pt-3 mt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Información adicional:</span>{' '}
                      {order.shippingAddress.additionalInfo}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>

              <div className="space-y-3 mb-6">
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
                      ? 'Gratis'
                      : formatPrice(order.shippingCost)}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>IVA:</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-indigo-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Método de pago:</p>
                  <p className="font-medium text-gray-900">
                    {order.paymentMethod === 'credit_card' && '💳 Tarjeta de Crédito'}
                    {order.paymentMethod === 'debit_card' && '💰 Tarjeta de Débito'}
                    {order.paymentMethod === 'cash_on_delivery' && '🏠 Contra Entrega'}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Estado de pago:</p>
                  <p
                    className={`font-medium ${order.paymentStatus === 'paid'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                      }`}
                  >
                    {order.paymentStatus === 'paid' && '✅ Pagado'}
                    {order.paymentStatus === 'pending' && '⏳ Pendiente'}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/orders"
                  className="block w-full text-center bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  ← Volver a Pedidos
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Contactar Soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}