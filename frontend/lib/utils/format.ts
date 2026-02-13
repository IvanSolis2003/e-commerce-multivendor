// lib/utils/format.ts

/**
 * Formatear precio a moneda chilena
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
}

/**
 * Calcular precio con descuento
 */
export function calculateDiscountedPrice(price: number, discount: number): number {
  if (discount <= 0) return price;
  return price * (1 - discount / 100);
}

/**
 * Calcular ahorro total
 */
export function calculateSavings(originalPrice: number, finalPrice: number): number {
  return originalPrice - finalPrice;
}

/**
 * Generar número de orden único
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

/**
 * Formatear fecha
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Obtener nombre legible del estado de la orden
 */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'En Proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return labels[status] || status;
}

/**
 * Obtener color del estado de la orden
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Obtener icono del estado de la orden
 */
export function getOrderStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    pending: '⏳',
    processing: '📦',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌',
  };
  return icons[status] || '📋';
}