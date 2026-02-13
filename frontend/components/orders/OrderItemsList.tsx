import { getStrapiMedia } from '@/lib/api';
import { formatPrice } from '@/lib/utils/format';

interface OrderItemsListProps {
  items: any[]; // Array de order items
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay items en esta orden
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        // Obtener imagen del producto
        const productImage = item.product?.images?.[0];
        const imageUrl = productImage 
          ? getStrapiMedia(productImage.url) 
          : '/placeholder.jpg';

        // Usar datos guardados en el order-item (por si el producto fue eliminado)
        const productName = item.productName;
        const productSku = item.productSku;
        const quantity = item.quantity;
        const price = item.price;
        const discount = item.discount;
        const subtotal = item.subtotal;

        return (
          <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
            {/* Imagen */}
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={imageUrl}
                alt={productName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info del producto */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{productName}</h4>
              {productSku && (
                <p className="text-xs text-gray-500 mt-1">SKU: {productSku}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Precio: {formatPrice(price)}
                </span>
                <span className="text-gray-600">
                  Cantidad: {quantity}
                </span>
                {discount > 0 && (
                  <span className="text-green-600 font-medium">
                    Descuento: {discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(subtotal)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}