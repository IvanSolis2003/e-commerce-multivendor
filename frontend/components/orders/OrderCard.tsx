import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: any; // TODO: Crear tipo Order más específico
}

export function OrderCard({ order }: OrderCardProps) {
  // Formatear método de pago
  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit_card: '💳 Tarjeta de Crédito',
      debit_card: '💰 Tarjeta de Débito',
      cash_on_delivery: '🏠 Contra Entrega',
      paypal: '🅿️ PayPal',
      stripe: '💵 Stripe',
    };
    return labels[method] || method;
  };

  return (
    <Link
      href={`/orders/${order.orderNumber}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        {/* Header - Número y Estado */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">Pedido</p>
            <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.orderStatus} />
        </div>

        {/* Detalles en Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Total */}
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-indigo-600">
              {formatPrice(order.totalAmount)}
            </p>
          </div>

          {/* Método de Pago */}
          <div>
            <p className="text-xs text-gray-500">Método de Pago</p>
            <p className="text-sm font-medium text-gray-900">
              {getPaymentMethodLabel(order.paymentMethod)}
            </p>
          </div>

          {/* Estado de Pago */}
          <div>
            <p className="text-xs text-gray-500">Estado de Pago</p>
            <p className={`text-sm font-medium ${
              order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {order.paymentStatus === 'paid' ? '✓ Pagado' : '⏳ Pendiente'}
            </p>
          </div>

          {/* Ciudad de Envío */}
          <div>
            <p className="text-xs text-gray-500">Envío</p>
            <p className="text-sm font-medium text-gray-900">
              {order.shippingAddress?.city || 'N/A'}
            </p>
          </div>
        </div>

        {/* Footer - Destinatario y Link */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            Enviando a: <span className="font-medium text-gray-700">{order.shippingAddress?.fullName}</span>
          </p>
          <span className="text-indigo-600 font-medium text-sm">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
}