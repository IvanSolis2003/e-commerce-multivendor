'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getOrderByNumberWithAuth, getOrderItems } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderItemsList } from '@/components/orders/OrderItemsList';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener el orderNumber de los params
  useEffect(() => {
    params.then((p) => setOrderNumber(p.orderNumber));
  }, [params]);

  // Proteger la ruta
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar orden y sus items
  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!orderNumber || !token) return;

      setIsLoading(true);

      try {
        // Cargar la orden
        const orderData = await getOrderByNumberWithAuth(orderNumber, token);
        
        if (!orderData) {
          setOrder(null);
          setIsLoading(false);
          return;
        }

        setOrder(orderData);

        // Cargar los items de la orden
        const items = await getOrderItems(orderData.id, token);
        setOrderItems(items);
      } catch (error) {
        console.error('Error al cargar la orden:', error);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && orderNumber && token) {
      loadOrderDetails();
    }
  }, [isAuthenticated, orderNumber, token]);

  // Estados de carga
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Orden no encontrada
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pedido no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            No pudimos encontrar el pedido #{orderNumber}
          </p>
          <Link
            href="/orders"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Volver a Mis Pedidos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600">
            Inicio
          </Link>
          <span>›</span>
          <Link href="/orders" className="hover:text-indigo-600">
            Mis Pedidos
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{order.orderNumber}</span>
        </nav>

        {/* Header con Estado */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pedido #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Realizado el {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.orderStatus} size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal - Items y Dirección */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items del Pedido */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Productos ({orderItems.length})
              </h2>
              <OrderItemsList items={orderItems} />
            </div>

            {/* Dirección de Envío */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📦 Dirección de Envío
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-gray-900">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-gray-600">{order.shippingAddress.street}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                <div className="pt-2 border-t mt-3">
                  <p className="text-sm text-gray-600">
                    📧 {order.shippingAddress.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    📱 {order.shippingAddress.phone}
                  </p>
                </div>
                {order.shippingAddress.additionalInfo && (
                  <p className="text-sm text-gray-500 italic pt-2">
                    ℹ️ {order.shippingAddress.additionalInfo}
                  </p>
                )}
              </div>
            </div>

            {/* Tracking (si existe) */}
            {order.trackingNumber && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🚚 Seguimiento de Envío
                </h2>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-700 mb-2">
                    Número de Seguimiento
                  </p>
                  <p className="text-lg font-mono font-bold text-indigo-900">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Columna lateral - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 space-y-6">
              {/* Resumen del Pedido */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Resumen del Pedido
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>

                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Descuentos:</span>
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

                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-indigo-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de Pago */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Método de Pago
                </h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">
                    {order.paymentMethod === 'credit_card' && '💳 Tarjeta de Crédito'}
                    {order.paymentMethod === 'debit_card' && '💰 Tarjeta de Débito'}
                    {order.paymentMethod === 'cash_on_delivery' && '🏠 Contra Entrega'}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {order.paymentStatus === 'paid' ? '✓ Pagado' : '⏳ Pendiente de Pago'}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="border-t pt-6 space-y-3">
                <Link
                  href="/orders"
                  className="block w-full text-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  ← Volver a Mis Pedidos
                </Link>

                <button className="w-full px-4 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition">
                  💬 Contactar Soporte
                </button>

                {order.orderStatus === 'delivered' && (
                  <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                    ⭐ Dejar Reseña
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}