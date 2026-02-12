'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '@/lib/contexts/CartContext';
import { getProductBySlug, getStrapiMedia } from '@/lib/api';
import { formatPrice } from '@/lib/utils/format';  // ← CAMBIO AQUÍ
import type { Product } from '@/types';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hook del carrito
  const { addItem } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar producto
  useEffect(() => {
    params.then(async (p) => {
      const productData = await getProductBySlug(p.slug);
      setProduct(productData);
      setIsLoading(false);
    });
  }, [params]);

  // Función para agregar al carrito
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem(product);
    
    // Mostrar mensaje de éxito
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  // Calcular precio con descuento
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const savings = price - finalPrice;

  // Obtener datos relacionados
  const category = product.category;
  const vendor = product.vendor;
  const reviews = product.reviews || [];
  const images = product.images || [];

  // Calcular rating promedio
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce">
          ✅ Producto agregado al carrito
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-indigo-600">
            Inicio
          </Link>
          <span>›</span>
          <Link href="/products" className="hover:text-indigo-600">
            Productos
          </Link>
          {category && (
            <>
              <span>›</span>
              <Link
                href={`/products?category=${category.slug}`}
                className="hover:text-indigo-600"
              >
                {category.name}
              </Link>
            </>
          )}
          <span>›</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Columna izquierda - Imágenes */}
            <div>
              <ProductImages images={images} productName={product.name} />
            </div>

            {/* Columna derecha - Información */}
            <div>
              {/* Categoría */}
              {category && (
                <Link
                  href={`/products?category=${category.slug}`}
                  className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm font-medium mb-3 hover:bg-indigo-200"
                >
                  {category.name}
                </Link>
              )}

              {/* Nombre del producto */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating y reseñas */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.round(avgRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {avgRating.toFixed(1)} ({reviews.length}{' '}
                    {reviews.length === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </div>
              )}

              {/* Precio */}
              <div className="mb-6">
                {discount > 0 && (
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(price)}
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                      -{discount}% OFF
                    </span>
                  </div>
                )}
                <div className="text-4xl font-bold text-indigo-600">
                  {formatPrice(finalPrice)}
                </div>
                {savings > 0 && (
                  <p className="text-green-600 mt-1">
                    Ahorras {formatPrice(savings)}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-700 font-medium">
                      En stock ({product.stock} disponibles)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-red-700 font-medium">Agotado</span>
                  </div>
                )}
              </div>

              {/* Marca */}
              {product.brand && (
                <div className="mb-6">
                  <span className="text-gray-600">Marca: </span>
                  <span className="font-semibold text-gray-900">
                    {product.brand}
                  </span>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <div className="mb-6 text-sm text-gray-500">
                  SKU: {product.sku}
                </div>
              )}

              {/* Botones de acción - ACTUALIZADO */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                    product.stock > 0
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0
                    ? '🛒 Agregar al carrito'
                    : 'Producto agotado'}
                </button>
                
                <Link
                  href="/cart"
                  className="block w-full py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition text-center"
                >
                  Ver Carrito
                </Link>
              </div>

              {/* Vendedor */}
              {vendor && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Vendido por:</h3>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {vendor.storeName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {vendor.storeName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⭐ {vendor.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{vendor.totalSales} ventas</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs de información adicional */}
          <div className="border-t">
            <ProductTabs
              description={product.description}
              specifications={product.specifications}
              reviews={reviews}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Resto de componentes (ProductImages, ProductTabs)
// ============================================================
function ProductImages({
  images,
  productName,
}: {
  images: any[];
  productName: string;
}) {
  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-lg">Sin imagen</span>
      </div>
    );
  }

  const mainImage = images[0];
  const imageUrl = getStrapiMedia(mainImage.url);

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
            >
              <img
                src={getStrapiMedia(image.url)}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductTabs({
  description,
  specifications,
  reviews,
}: {
  description: any;
  specifications?: any;
  reviews: any[];
}) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
        <div className="prose max-w-none text-gray-600">
          {typeof description === 'string' ? (
            <p>{description}</p>
          ) : (
            <p>
              {description?.[0]?.children?.[0]?.text ||
                'Sin descripción disponible'}
            </p>
          )}
        </div>
      </div>

      {specifications && Object.keys(specifications).length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Especificaciones Técnicas
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500 capitalize">
                    {key}
                  </dt>
                  <dd className="mt-1 text-base text-gray-900">
                    {String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Reseñas de Clientes ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {review.isVerifiedPurchase && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      ✓ Compra verificada
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h4>
                <p className="text-gray-600">{review.comment}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <button className="hover:text-indigo-600">
                    👍 Útil ({review.helpfulCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aún no hay reseñas para este producto.</p>
        )}
      </div>
    </div>
  );
}