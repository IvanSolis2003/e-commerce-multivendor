import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';

export default async function HomePage() {
  // Obtener productos destacados desde Strapi
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
            <div className="flex justify-center gap-4">
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

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Categorías Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard name="Electrónicos" icon="💻" slug="electronicos" />
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