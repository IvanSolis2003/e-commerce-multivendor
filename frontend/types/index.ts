// types/index.ts - Actualizado para Strapi v5

export interface StrapiImage {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width: number;
  height: number;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  description: any;
  slug: string;
  image?: StrapiImage | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Vendor {
  id: number;
  documentId: string;
  storeName: string;
  storeDescription?: any;
  slug: string;
  logo?: StrapiImage | null;
  banner?: StrapiImage | null;
  isApproved: boolean;
  isActive: boolean;
  rating: number;
  totalSales: number;
  commission: number;
  phone?: string;
  address?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Review {
  id: number;
  documentId: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  images?: StrapiImage[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  description: any;
  price: number;
  stock: number;
  slug: string;
  sku?: string;
  featured: boolean;
  isActive: boolean;
  discount: number;
  brand?: string;
  specifications?: any;
  images?: StrapiImage[] | null;
  category?: Category | null;
  vendor?: Vendor | null;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Order {
  id: number;
  documentId: string;
  orderNumber: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: any;
  customerNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}