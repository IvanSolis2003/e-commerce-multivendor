import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import type { Product } from '@/types';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  // Hacer await de searchParams (Next.js 16)
  const params = await searchParams;

  // Obtener productos y categorías desde Strapi
  const allProducts = await getProducts();
  const categories = await getCategories();

  // Filtrar productos según los parámetros de búsqueda
  let filteredProducts = allProducts;

  // Filtrar por categoría si existe el parámetro
  if (params.category) {
    filteredProducts = filteredProducts.filter((product) => {
      const categorySlug = product.category?.slug;
      return categorySlug === params.category;
    });
  }

  // Filtrar por búsqueda si existe el parámetro
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProducts = filteredProducts.filter((product) =>
      product.name?.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Todos los Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra colección completa de productos
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Filtros</h2>

              {/* Búsqueda */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <form action="/products" method="get">
                  <input
                    type="text"
                    name="search"
                    placeholder="Buscar productos..."
                    defaultValue={params.search || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </form>
              </div>

              {/* Categorías */}
              <div>
                <h3 className="font-semibold mb-3">Categorías</h3>
                <ul className="space-y-2">
                  {/* Opción "Todas" */}
                  <li>
                    <Link
                      href="/products"
                      className={`block px-3 py-2 rounded transition ${
                        !params.category
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Todas las categorías
                    </Link>
                  </li>

                  {/* Lista de categorías */}
                  {categories.map((category) => {
                    if (!category.slug || !category.name) {
                      return null;
                    }

                    return (
                      <li key={category.id}>
                        <Link
                          href={`/products?category=${category.slug}`}
                          className={`block px-3 py-2 rounded transition ${
                            params.category === category.slug
                              ? 'bg-indigo-50 text-indigo-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Botón limpiar filtros */}
              {(params.category || params.search) && (
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Limpiar Filtros
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Grid de productos */}
          <div className="flex-1">
            {/* Contador de resultados */}
            <div className="mb-6">
              <p className="text-gray-600">
                Mostrando <span className="font-semibold">{filteredProducts.length}</span>{' '}
                {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>

            {/* Grid usando ProductCard */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <div className="text-6xl mb-4">😕</div>
                <p className="text-xl text-gray-700 font-semibold mb-2">
                  No se encontraron productos
                </p>
                <p className="text-gray-500 mb-4">
                  {params.search
                    ? `No hay productos que coincidan con "${params.search}"`
                    : 'No hay productos en esta categoría'}
                </p>
                <Link
                  href="/products"
                  className="inline-block text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  ← Ver todos los productos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}