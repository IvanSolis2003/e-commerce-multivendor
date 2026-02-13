// lib/api.ts
import axios from 'axios';
import type { StrapiResponse, Product, Category, Vendor } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

// Crear instancia de axios
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// Funciones para obtener datos
// ============================================================

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<StrapiResponse<Product[]>>(
    '/products?populate=*'
  );
  return response.data.data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await api.get<StrapiResponse<Product[]>>(
    `/products?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data.data[0] || null;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<StrapiResponse<Category[]>>(
    '/categories?populate=*'
  );
  return response.data.data;
}

export async function getVendors(): Promise<Vendor[]> {
  const response = await api.get<StrapiResponse<Vendor[]>>(
    '/vendors?populate=*'
  );
  return response.data.data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api.get<StrapiResponse<Product[]>>(
    '/products?filters[featured][$eq]=true&populate=*'
  );
  return response.data.data;
}

// ============================================================
// Función helper para construir URLs de imágenes
// ============================================================
export function getStrapiMedia(url: string | undefined): string {
  if (!url) return '/placeholder.jpg';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
}

// ============================================================
// Funciones para crear órdenes
// ============================================================

/**
 * Crear una nueva orden en Strapi
 */
export async function createOrder(orderData: any, token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await api.post(
      '/orders',
      {
        data: orderData,
      },
      { headers }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error al crear la orden:', error);
    throw error;
  }
}

/**
 * Crear items de una orden
 */
export async function createOrderItems(items: Array<{
  orderId: number;
  productId: number;
  productName: string;
  productSku?: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}>, token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    // Crear todos los items en paralelo
    const promises = items.map((item) =>
      api.post(
        '/order-items',
        {
          data: {
            order: item.orderId,
            product: item.productId,
            productName: item.productName,
            productSku: item.productSku || '',
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            subtotal: item.subtotal,
          },
        },
        { headers }
      )
    );

    const responses = await Promise.all(promises);
    return responses.map((res) => res.data.data);
  } catch (error) {
    console.error('Error al crear los items de la orden:', error);
    throw error;
  }
}

// ============================================================
// Funciones para obtener órdenes del usuario
// ============================================================

/**
 * Obtener todas las órdenes (filtradas por usuario si tiene token)
 */
export async function getUserOrders(token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await api.get('/orders?populate=*&sort=createdAt:desc', {
      headers,
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return [];
  }
}

/**
 * Obtener una orden específica por número
 */
export async function getOrderByNumberWithAuth(orderNumber: string, token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await api.get(
      `/orders?filters[orderNumber][$eq]=${orderNumber}&populate=*`,
      { headers }
    );
    
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    return null;
  }
}

/**
 * Obtener items de una orden
 */
export async function getOrderItems(orderId: number, token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await api.get(
      `/order-items?filters[order][id][$eq]=${orderId}&populate=*`,
      { headers }
    );
    
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener items de la orden:', error);
    return [];
  }
}

// ============================================================
// Funciones de autenticación
// ============================================================

/**
 * Registrar un nuevo usuario
 */
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local/register`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
}

/**
 * Iniciar sesión
 */
export async function loginUser(data: { identifier: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
}

/**
 * Obtener información del usuario actual
 */
export async function getCurrentUser(token: string) {
  try {
    const response = await axios.get(`${API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
}

export default api;