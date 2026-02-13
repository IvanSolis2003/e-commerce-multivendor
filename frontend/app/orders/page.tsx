'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getUserOrders } from '@/lib/api';
import { OrderCard } from '@/components/orders/OrderCard';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  // Proteger la ruta - solo usuarios autenticados
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar órdenes del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (token) {
        setIsLoading(true);
        const ordersData = await getUserOrders(token);
        setOrders(ordersData);
        setIsLoading(false);
      }
    };

    if (isAuthenticated && token) {
      loadOrders();
    }
  }, [isAuthenticated, token]);

  // Filtrar órdenes por estado
  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === filter);

  // Mostrar loading mientras carga
  if (authLoading || (isLoading && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (está redirigiendo)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona y revisa el estado de tus pedidos
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Filtrar:</span>
            
            {/* Todos */}
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({orders.length})
            </button>
            
            {/* Pendientes */}
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ Pendientes ({orders.filter(o => o.orderStatus === 'pending').length})
            </button>
            
            {/* En Proceso */}
            <button
              onClick={() => setFilter('processing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'processing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 En Proceso ({orders.filter(o => o.orderStatus === 'processing').length})
            </button>
            
            {/* Entregados */}
            <button
              onClick={() => setFilter('delivered')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'delivered'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Entregados ({orders.filter(o => o.orderStatus === 'delivered').length})
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
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No tienes pedidos' : 'No hay pedidos con este estado'}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? '¡Comienza a comprar y tus pedidos aparecerán aquí!'
                : 'Intenta cambiar el filtro para ver otros pedidos'}
            </p>
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Explorar Productos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}