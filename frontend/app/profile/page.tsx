'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getUserOrders } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Proteger la ruta
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar órdenes del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const ordersData = await getUserOrders(token);
          setOrders(ordersData);
        }
        setIsLoadingOrders(false);
      }
    };

    loadOrders();
  }, [isAuthenticated]);

  // Loading
  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Calcular estadísticas
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'delivered').length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info del usuario */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar y nombre */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {user.username}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {user.email}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span className={`w-2 h-2 rounded-full ${user.confirmed ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {user.confirmed ? 'Verificado' : 'Pendiente de verificación'}
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total de pedidos:</span>
                  <span className="font-bold text-indigo-600">{totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pendientes:</span>
                  <span className="font-bold text-yellow-600">{pendingOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Entregados:</span>
                  <span className="font-bold text-green-600">{deliveredOrders}</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-gray-600">Total gastado:</span>
                  <span className="font-bold text-gray-900">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                    }).format(totalSpent)}
                  </span>
                </div>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Accesos Rápidos</h3>
              <div className="space-y-2">
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  📦 Mis Pedidos
                </Link>
                <Link
                  href="/cart"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  🛒 Mi Carrito
                </Link>
                <Link
                  href="/products"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  🛍️ Seguir Comprando
                </Link>
              </div>
            </div>
          </div>

          {/* Columna derecha - Información detallada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Información Personal
                </h3>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                  Editar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de Usuario
                  </label>
                  <p className="text-gray-900">{user.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Miembro desde
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de la cuenta
                  </label>
                  <p className="text-gray-900">
                    {user.blocked ? (
                      <span className="text-red-600">❌ Bloqueada</span>
                    ) : (
                      <span className="text-green-600">✓ Activa</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Últimos pedidos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Últimos Pedidos
                </h3>
                <Link
                  href="/orders"
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Ver todos →
                </Link>
              </div>

              {isLoadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin text-4xl mb-2">⏳</div>
                  <p className="text-gray-500">Cargando pedidos...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.orderNumber}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('es-CL')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-indigo-600">
                            {new Intl.NumberFormat('es-CL', {
                              style: 'currency',
                              currency: 'CLP',
                            }).format(order.totalAmount)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.orderStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.orderStatus === 'pending' && '⏳ Pendiente'}
                            {order.orderStatus === 'processing' && '📦 En Proceso'}
                            {order.orderStatus === 'delivered' && '✅ Entregado'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-2">📦</div>
                  <p className="text-gray-500">No tienes pedidos aún</p>
                  <Link
                    href="/products"
                    className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Comenzar a comprar →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}