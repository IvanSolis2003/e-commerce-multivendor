import Link from 'next/link';
import { getVendors } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
  // Obtener todos los vendedores desde Strapi
  const vendors = await getVendors();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nuestras Tiendas
          </h1>
          <p className="text-gray-600">
            Descubre vendedores confiables con productos de calidad
          </p>
        </div>

        {/* Grid de vendedores */}
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">🏪</div>
            <p className="text-xl text-gray-700 font-semibold mb-2">
              No hay tiendas disponibles
            </p>
            <p className="text-gray-500">
              Las tiendas aparecerán aquí cuando estén disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Componente: Tarjeta de Vendedor
// ============================================================
function VendorCard({ vendor }: { vendor: any }) {
  // Obtener productos del vendedor (si existe la relación)
  const productCount = vendor.products?.length || 0;

  // Rating y ventas
  const rating = vendor.rating || 0;
  const totalSales = vendor.totalSales || 0;
  const isVerified = vendor.isVerified || false;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Header con avatar */}
      <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <span className="text-4xl font-bold text-indigo-600">
              {vendor.storeName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="pt-14 px-6 pb-6">
        {/* Nombre de la tienda */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900">
            {vendor.storeName}
          </h3>
          {isVerified && (
            <span className="text-blue-500" title="Vendedor verificado">
              ✓
            </span>
          )}
        </div>

        {/* Descripción */}
        {vendor.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {vendor.description}
          </p>
        )}

        {/* Estadísticas */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span>
            <span className="font-semibold text-gray-900">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Ventas */}
          <div className="flex items-center gap-1">
            <span className="text-gray-400">📦</span>
            <span className="text-gray-600">
              {totalSales} ventas
            </span>
          </div>
        </div>

        {/* Productos */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
        </div>

        {/* Contacto */}
        {vendor.contactEmail && (
          <div className="text-sm text-gray-600 mb-4">
            <span className="text-gray-400">✉️</span> {vendor.contactEmail}
          </div>
        )}

        {/* Botón */}
        <Link
          href={`/vendors/${vendor.documentId}`}
          className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Ver Tienda
        </Link>
      </div>
    </div>
  );
}