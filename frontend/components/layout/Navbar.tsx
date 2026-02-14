'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();
  const { getItemCount } = useCart();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  const itemCount = getItemCount();

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">
              🛍️ E-Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Inicio
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Productos
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Categorías
            </Link>
            <Link 
              href="/vendors" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Tiendas
            </Link>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                🔍
              </button>
            </form>
          </div>

          {/* Right side - Cart & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <span className="text-2xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg"></div>
            ) : isAuthenticated && user ? (
              /* Usuario logueado - Menú desplegable */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">{user.username}</span>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm text-gray-500">Conectado como</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      👤 Mi Perfil
                    </Link>
                    
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      📦 Mis Pedidos
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      ⚙️ Configuración
                    </Link>
                    
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Usuario no logueado */
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  Iniciar Sesión
                </Link>
                
                <Link 
                  href="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search button - Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              🔍
            </button>

            {/* Cart - Mobile */}
            <Link 
              href="/cart" 
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <span className="text-xl">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="px-4 py-2 hover:bg-gray-100 rounded">
                Inicio
              </Link>
              <Link href="/products" className="px-4 py-2 hover:bg-gray-100 rounded">
                Productos
              </Link>
              <Link href="/categories" className="px-4 py-2 hover:bg-gray-100 rounded">
                Categorías
              </Link>
              <Link href="/vendors" className="px-4 py-2 hover:bg-gray-100 rounded">
                Tiendas
              </Link>
              
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-3">
                    <p className="text-sm text-gray-500 mb-1">Hola, {user.username}</p>
                  </div>
                  <Link href="/profile" className="px-4 py-2 hover:bg-gray-100 rounded">
                    👤 Mi Perfil
                  </Link>
                  <Link href="/orders" className="px-4 py-2 hover:bg-gray-100 rounded">
                    📦 Mis Pedidos
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 hover:bg-gray-100 rounded">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded text-center">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white p-4">
            <div className="flex items-center gap-2 mb-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  autoFocus
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Buscar
                </button>
              </form>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}