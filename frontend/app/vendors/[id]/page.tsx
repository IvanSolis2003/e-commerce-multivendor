import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getVendorById, getStrapiMedia, getProductsByVendorId } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard'; // Assuming this exists based on standard e-commerce projects

export default async function VendorDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const vendor = await getVendorById(params.id);

    if (!vendor) {
        notFound();
    }

    const products = await getProductsByVendorId(params.id);
    const rating = vendor.rating || 0;
    const isVerified = vendor.isVerified || false; // Used in vendor search but checking if it exists

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Banner de la tienda */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-indigo-700 to-purple-800 w-full overflow-hidden">
                {vendor.banner && (
                    <Image
                        src={getStrapiMedia(vendor.banner?.url)}
                        alt={`Banner de ${vendor.storeName}`}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24">
                {/* Tarjeta principal del vendedor */}
                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-12">
                    {/* Logo del vendedor */}
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden relative">
                        {vendor.logo ? (
                            <Image
                                src={getStrapiMedia(vendor.logo?.url)}
                                alt={`Logo de ${vendor.storeName}`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-6xl font-bold text-indigo-600">
                                {vendor.storeName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {vendor.storeName}
                            </h1>
                            {isVerified && (
                                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium flex items-center w-fit mx-auto md:mx-0">
                                    <span className="mr-1">✓</span> Verificado
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-6 max-w-2xl text-lg">
                            {vendor.storeDescription || 'Bienvenido a nuestra tienda. Explorá nuestros productos de alta calidad.'}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                <span className="text-yellow-400 text-lg">⭐</span>
                                <span className="font-semibold text-gray-900 text-base">{rating.toFixed(1)}</span>
                                <span className="text-gray-500">calificación</span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                <span className="text-xl">📦</span>
                                <span className="font-semibold text-gray-900 text-base">{vendor.totalSales || 0}</span>
                                <span className="text-gray-500">ventas</span>
                            </div>

                            {vendor.createdAt && (
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    <span className="text-xl">📅</span>
                                    <span className="text-gray-500">Miembro desde {new Date(vendor.createdAt).getFullYear()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sección de Productos */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Productos de {vendor.storeName}
                    </h2>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {products.length} {products.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <span className="text-6xl mb-4 block">🛍️</span>
                        <h3 className="text-xl text-gray-800 font-semibold mb-2">No hay productos disponibles</h3>
                        <p className="text-gray-500">Esta tienda aún no ha publicado ningún producto.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
