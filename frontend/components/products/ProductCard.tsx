import Link from 'next/link';
import { getStrapiMedia } from '@/lib/api';
import { formatPrice } from '@/lib/utils/format';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  // Obtener imagen
  const image = product.images?.[0];
  const imageUrl = image ? getStrapiMedia(image.url) : '/placeholder.jpg';

  // Calcular precio
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  // Obtener datos relacionados
  const category = product.category?.name;
  const vendor = product.vendor?.storeName;
  const stock = product.stock || 0;

  // Variante compacta (para home - 4 columnas)
  if (variant === 'compact') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
      >
        {/* Imagen */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
          {discount > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
              -{discount}%
            </span>
          )}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded font-bold text-sm">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              {discount > 0 && (
                <p className="text-sm text-gray-500 line-through">
                  {formatPrice(price)}
                </p>
              )}
              <p className="text-lg font-bold text-indigo-600">
                {formatPrice(finalPrice)}
              </p>
            </div>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition text-sm">
              Ver
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Variante por defecto (para listado - 3 columnas)
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Imagen del producto */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name || 'Producto'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de descuento */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discount}%
          </span>
        )}

        {/* Overlay de agotado */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Categoría y Vendedor */}
        <div className="flex items-center gap-2 mb-2 text-xs flex-wrap">
          {category && (
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              {category}
            </span>
          )}
          {vendor && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded truncate max-w-[150px]">
              🏪 {vendor}
            </span>
          )}
        </div>

        {/* Nombre del producto */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors">
          {product.name || 'Producto sin nombre'}
        </h3>

        {/* Marca */}
        {product.brand && (
          <p className="text-sm text-gray-500 mb-2">
            Marca: <span className="font-medium">{product.brand}</span>
          </p>
        )}

        {/* Precio */}
        <div className="flex items-baseline gap-2 mb-3">
          {discount > 0 && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(price)}
            </p>
          )}
          <p className="text-xl font-bold text-indigo-600">
            {formatPrice(finalPrice)}
          </p>
        </div>

        {/* Stock y botón */}
        <div className="flex items-center justify-between text-sm">
          <span
            className={`font-medium ${
              stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
          </span>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Ver detalles
          </button>
        </div>
      </div>
    </Link>
  );
}