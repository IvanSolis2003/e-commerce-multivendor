'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/contexts/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Usar el carrito para obtener la cantidad de items
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

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

          {/* Right side - Cart & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              🔍
            </button>

            {/* Cart con contador actualizado */}
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

            {/* Login */}
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Iniciar Sesión
            </Link>
            
            {/* Register */}
            <Link 
              href="/register" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
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
              <Link href="/cart" className="px-4 py-2 hover:bg-gray-100 rounded">
                🛒 Carrito ({itemCount})
              </Link>
              <Link href="/login" className="px-4 py-2 hover:bg-gray-100 rounded">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="px-4 py-2 bg-indigo-600 text-white rounded text-center">
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}