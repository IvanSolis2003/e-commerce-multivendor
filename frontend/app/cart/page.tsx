'use client';

import Link from 'next/link';
import { useCart } from '@/lib/contexts/CartContext';
import { getStrapiMedia } from '@/lib/api';
import { formatPrice } from '@/lib/utils/format'; 

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, clearCart } = useCart();

  // Calcular el ahorro total
  const subtotal = getSubtotal();
  const total = getTotal();
  const savings = subtotal - total;

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            ¡Agrega algunos productos para comenzar!
          </p>
          <Link
            href="/products"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            {/* Botón vaciar carrito */}
            <button
              onClick={clearCart}
              className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Columna derecha - Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Ahorros:</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span className="text-green-600">Gratis</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-indigo-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"  
                className="block w-full bg-indigo-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-indigo-700 transition mb-3"
>
  Proceder al Pago
                Proceder al Pago
              </Link>

              <Link
                href="/products"
                className="block w-full text-center text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Componente: Item del Carrito
// ============================================================
function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: any;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}) {
  const { product, quantity } = item;

  // Obtener imagen
  const image = product.images?.[0];
  const imageUrl = image ? getStrapiMedia(image.url) : '/placeholder.jpg';

  // Calcular precio
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const itemTotal = finalPrice * quantity;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      {/* Imagen */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      </Link>

      {/* Información */}
      <div className="flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2"
        >
          {product.name}
        </Link>

        {product.brand && (
          <p className="text-sm text-gray-500 mt-1">Marca: {product.brand}</p>
        )}

        <div className="mt-2">
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through mr-2">
              {formatPrice(price)}
            </span>
          )}
          <span className="text-lg font-bold text-indigo-600">
            {formatPrice(finalPrice)}
          </span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-col items-end justify-between">
        {/* Precio total del item */}
        <p className="text-xl font-bold text-gray-900">
          {formatPrice(itemTotal)}
        </p>

        {/* Selector de cantidad */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition font-bold"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= (product.stock || 0)}
            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium mt-2"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}