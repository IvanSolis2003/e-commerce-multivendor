'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product } from '@/types';

// ============================================================
// Tipos para el carrito
// ============================================================

// Representa un item en el carrito
export interface CartItem {
  product: Product;
  quantity: number;
}

// Funciones disponibles del carrito
interface CartContextType {
  items: CartItem[];                           // Lista de items
  addItem: (product: Product) => void;         // Agregar producto
  removeItem: (productId: number) => void;     // Eliminar producto
  updateQuantity: (productId: number, quantity: number) => void; // Cambiar cantidad
  clearCart: () => void;                       // Vaciar carrito
  getItemCount: () => number;                  // Total de items
  getSubtotal: () => number;                   // Subtotal sin descuentos
  getTotal: () => number;                      // Total con descuentos
}

// ============================================================
// Crear el Context
// ============================================================
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================================
// Provider del Carrito (envuelve toda la app)
// ============================================================
export function CartProvider({ children }: { children: ReactNode }) {
  // Estado: lista de items en el carrito
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Estado: indica si ya cargamos desde localStorage
  const [isLoaded, setIsLoaded] = useState(false);

  // ============================================================
  // Cargar carrito desde localStorage al inicio
  // ============================================================
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // ============================================================
  // Guardar en localStorage cada vez que cambia el carrito
  // ============================================================
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // ============================================================
  // Agregar producto al carrito
  // ============================================================
  const addItem = (product: Product) => {
    setItems((prevItems) => {
      // Buscar si el producto ya existe en el carrito
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Si existe, aumentar la cantidad
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        return [...prevItems, { product, quantity: 1 }];
      }
    });
  };

  // ============================================================
  // Eliminar producto del carrito
  // ============================================================
  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // ============================================================
  // Actualizar cantidad de un producto
  // ============================================================
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // Si la cantidad es 0 o menor, eliminar el producto
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // ============================================================
  // Vaciar el carrito
  // ============================================================
  const clearCart = () => {
    setItems([]);
  };

  // ============================================================
  // Obtener total de items (suma de todas las cantidades)
  // ============================================================
  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // ============================================================
  // Calcular subtotal (precio original × cantidad)
  // ============================================================
  const getSubtotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // ============================================================
  // Calcular total (con descuentos aplicados)
  // ============================================================
  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.price || 0;
      const discount = item.product.discount || 0;
      const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
      return total + finalPrice * item.quantity;
    }, 0);
  };

  // ============================================================
  // Valor del contexto (funciones y datos disponibles)
  // ============================================================
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    getSubtotal,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ============================================================
// Hook personalizado para usar el carrito
// ============================================================
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}