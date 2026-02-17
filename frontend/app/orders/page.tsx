'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getUserOrders } from '@/lib/api';
import { OrderCard } from '@/components/orders/OrderCard';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Proteger la ruta
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar órdenes del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const ordersData = await getUserOrders(token);
        setOrders(ordersData);
      } catch (err: any) {
        console.error('Error al cargar órdenes:', err);
        const detailedError = err.response?.data?.error?.message || err.message || 'Error desconocido';
        setError(`Error al cargar tus pedidos: ${detailedError}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && token) {
      loadOrders();
    }
  }, [isAuthenticated, token]);

  // Loading
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-600">Cargando tus pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar órdenes
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((order) => order.orderStatus === filter);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Consulta el estado de tus pedidos recientes
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ⏳ Pendientes ({orders.filter((o) => o.orderStatus === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'processing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              📦 En Proceso ({orders.filter((o) => o.orderStatus === 'processing').length})
            </button>
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'delivered'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ✅ Entregados ({orders.filter((o) => o.orderStatus === 'delivered').length})
            </button>
          </div>
        </div>

        {/* Lista de órdenes */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">
              {filter === 'all' ? '📦' : '🔍'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No tienes pedidos aún' : 'No hay pedidos con este estado'}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'Explora nuestros productos y realiza tu primera compra'
                : 'Intenta con otro filtro para ver más pedidos'}
            </p>
            <div className="flex gap-4 justify-center">
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Ver Todos
                </button>
              )}
              <Link
                href="/products"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Ver Productos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}