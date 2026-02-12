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