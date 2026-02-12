'use client';

import { useCart } from '@/lib/contexts/CartContext';
import { formatPrice } from '@/lib/utils/format';
import { getStrapiMedia } from '@/lib/api';

export function OrderSummary() {
  const { items, getSubtotal, getTotal } = useCart();

  const subtotal = getSubtotal();
  const total = getTotal();
  const savings = subtotal - total;
  const shippingCost = 0; // Gratis por ahora
  const tax = 0; // IVA incluido

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Resumen del Pedido
      </h2>

      {/* Lista de productos */}
      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
        {items.map((item) => {
          const image = item.product.images?.[0];
          const imageUrl = image ? getStrapiMedia(image.url) : '/placeholder.jpg';
          const price = item.product.price || 0;
          const discount = item.product.discount || 0;
          const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

          return (
            <div key={item.product.id} className="flex gap-3">
              {/* Imagen */}
              <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded"
                />
                {/* Badge de cantidad */}
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {item.quantity}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {item.product.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatPrice(finalPrice)} × {item.quantity}
                </p>
              </div>

              {/* Total */}
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {formatPrice(finalPrice * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divisor */}
      <div className="border-t pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'}):</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Ahorros */}
        {savings > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Descuentos:</span>
            <span>-{formatPrice(savings)}</span>
          </div>
        )}

        {/* Envío */}
        <div className="flex justify-between text-gray-600">
          <span>Envío:</span>
          <span className="text-green-600 font-medium">
            {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
          </span>
        </div>

        {/* IVA */}
        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>IVA (19%):</span>
            <span>{formatPrice(tax)}</span>
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
          <span>Total:</span>
          <span className="text-indigo-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Beneficios */}
      <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Envío gratis en todos los pedidos</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Garantía de devolución 30 días</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">✓</span>
          <span>Pago seguro y protegido</span>
        </div>
      </div>
    </div>
  );
}