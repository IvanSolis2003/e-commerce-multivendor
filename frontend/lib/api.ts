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

// Funciones para obtener datos

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

// Función helper para construir URLs de imágenes
export function getStrapiMedia(url: string | undefined): string {
  if (!url) return '/placeholder-image.jpg';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
}

// Función helper para formatear precios
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
}

export default api;