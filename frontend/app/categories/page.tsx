import Link from 'next/link';
import { getCategories } from '@/lib/api';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Categorías
          </h1>
          <p className="text-gray-600">
            Explora nuestras categorías y encuentra lo que buscas
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl text-gray-700 font-semibold mb-2">
              No hay categorías disponibles
            </p>
            <p className="text-gray-500">
              Las categorías aparecerán aquí cuando estén disponibles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: any }) {
  const productCount = category.products?.length || 0;

  if (!category?.name || !category?.slug) {
    return null;
  }

  // 👇 convertir RichText de Strapi a string
  const descriptionText =
    category.description?.[0]?.children?.[0]?.text || '';

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="text-6xl group-hover:scale-110 transition-transform">
          {getCategoryIcon(category.name)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {category.name}
        </h3>

        {descriptionText && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {descriptionText}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">
            {productCount} {productCount === 1 ? 'producto' : 'productos'}
          </span>
          <span className="text-indigo-600 font-medium text-sm">
            Ver todos →
          </span>
        </div>
      </div>
    </Link>
  );
}

function getCategoryIcon(categoryName: string | undefined): string {
  if (!categoryName) return '📦';

  const name = categoryName.toLowerCase().trim();

  const iconMap: Record<string, string> = {
    'electrón': '💻',
    'tecn': '💻',
    'electr': '💻',
    'comput': '💻',
    'ropa': '👕',
    'moda': '👕',
    'vestir': '👕',
    'hogar': '🏡',
    'casa': '🏡',
    'deport': '⚽',
    'fitness': '⚽',
    'ejercicio': '⚽',
    'libro': '📚',
    'lectura': '📚',
    'juguete': '🧸',
    'niño': '🧸',
    'infantil': '🧸',
    'aliment': '🍔',
    'comida': '🍔',
    'belleza': '💄',
    'cosmét': '💄',
    'maquillaje': '💄',
    'música': '🎵',
    'audio': '🎵',
    'sonido': '🎵',
    'auto': '🚗',
    'coche': '🚗',
    'vehículo': '🚗',
    'mascota': '🐾',
    'pet': '🐾',
    'animal': '🐾',
    'jardín': '🌱',
    'planta': '🌱',
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon;
    }
  }

  return '📦';
}
