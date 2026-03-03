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
  try {
    const response = await api.get<StrapiResponse<Product[]>>(
      '/products?populate=*&pagination[pageSize]=100'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await api.get<StrapiResponse<Product[]>>(
      `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
    );
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return null;
  }
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

export async function getVendorById(identifier: string): Promise<Vendor | null> {
  try {
    const field = isNaN(Number(identifier)) ? 'documentId' : 'id';
    const response = await api.get<StrapiResponse<Vendor[]>>(
      `/vendors?filters[${field}][$eq]=${identifier}&populate=*`
    );
    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error al obtener el vendedor:', error);
    return null;
  }
}

export async function getProductsByVendorId(vendorIdentifier: string): Promise<Product[]> {
  try {
    const field = isNaN(Number(vendorIdentifier)) ? 'documentId' : 'id';
    const response = await api.get<StrapiResponse<Product[]>>(
      `/products?filters[vendor][${field}][$eq]=${vendorIdentifier}&populate=*&pagination[pageSize]=100`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener productos del vendedor:', error);
    return [];
  }
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

    // El backend auto-asigna el usuario autenticado basado en el token JWT

    const response = await api.post(
      '/orders',
      {
        data: orderData,
      },
      { headers }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('Error al crear la orden:', error?.response?.data || error);
    throw error;
  }
}


/**
 * Crear items de una orden
 */
export async function createOrderItems(items: Array<{
  orderId: number | string;
  productId: number | string;
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

export async function getUserOrders(token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await api.get('/orders', {
      headers,
    });

    return response.data.data;
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return [];
  }
}

export async function getOrderByNumberWithAuth(orderNumber: string, token: string) {
  try {
    const response = await api.get(
      `/orders?filters[orderNumber][$eq]=${orderNumber}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data[0] || null;
  } catch (error) {
    console.error('Error al obtener la orden:', error);
    return null;
  }
}

export async function getOrderItems(orderId: string | number, token?: string) {
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    // En Strapi 5, si recibimos un string, es un documentId. Si es un number, es un ID.
    // Usamos documentId preferiblemente para relaciones en Strapi 5.
    const field = typeof orderId === 'string' ? 'documentId' : 'id';
    const response = await api.get(
      `/order-items?filters[order][${field}][$eq]=${orderId}&populate=*`,
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

export async function loginUser(data: { identifier: string; password: string }) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/local`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
}

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

export async function forgotPassword(email: string) {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.error || error;
  }
}

export default api;
