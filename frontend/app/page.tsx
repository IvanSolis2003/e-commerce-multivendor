import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';

export const revalidate = 60; // Revalidar cada 60 segundos

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bienvenido a E-Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Descubre los mejores productos de vendedores confiables
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/products"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Ver Productos
              </Link>
              <Link
                href="/vendors"
                className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition border-2 border-white"
              >
                Explorar Tiendas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Productos Destacados
          </h2>
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Ver todos →
          </Link>
        </div>

        {/* Products Grid usando ProductCard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="compact" />
          ))}
        </div>

        {featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay productos destacados disponibles
            </p>
          </div>
        )}
      </section>

      {/* CTA para Vendedores */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🏪</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Tienes un negocio? Vende en E-Shop
            </h2>
            <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
              Únete a cientos de vendedores exitosos, aumenta tus ventas y alcanza miles de clientes
            </p>

            {/* Beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              {/* Tarjeta 1: Aumenta tus Ventas */}
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border border-white border-opacity-30">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-bold text-lg mb-2 text-black">Aumenta tus Ventas</h3>
                <p className="text-black text-opacity-90 text-sm">
                  Accede a miles de clientes potenciales cada día
                </p>
              </div>

              {/* Tarjeta 2: Pagos Seguros */}
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border border-white border-opacity-30">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-bold text-lg mb-2 text-black">Pagos Seguros</h3>
                <p className="text-black text-opacity-90 text-sm">
                  Sistema de pagos protegido y confiable
                </p>
              </div>

              {/* Tarjeta 3: Panel de Control */}
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-6 border border-white border-opacity-30">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2 text-black">Panel de Control</h3>
                <p className="text-black text-opacity-90 text-sm">
                  Gestiona tu tienda y productos fácilmente
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/vendor-signup"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg shadow-lg"
              >
                Solicitar Vender →
              </Link>
              <Link
                href="/vendors"
                className="bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-800 transition border-2 border-white text-lg"
              >
                Ver Vendedores Exitosos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard name="Tecnología" icon="💻" slug="tecnologia" />
            <CategoryCard name="Ropa y Moda" icon="👕" slug="ropa" />
            <CategoryCard name="Hogar y Jardín" icon="🏡" slug="hogar" />
            <CategoryCard name="Deportes" icon="⚽" slug="deportes" />
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// Componente: Category Card
// ============================================================
function CategoryCard({ name, icon, slug }: { name: string; icon: string; slug: string }) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition group"
    >
      <div className="text-5xl mb-3 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{name}</h3>
    </Link>
  );
}
