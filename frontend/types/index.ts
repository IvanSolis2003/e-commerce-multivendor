// types/index.ts

export interface StrapiImage {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  width: number;
  height: number;
}

export interface StrapiMediaData {
  id: number;
  attributes: StrapiImage;
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    description: string;
    slug: string;
    image?: {
      data: StrapiMediaData;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Product {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    stock: number;
    slug: string;
    sku?: string;
    featured: boolean;
    isActive: boolean;
    discount: number;
    brand?: string;
    specifications?: any;
    images?: {
      data: StrapiMediaData[];
    };
    category?: {
      data: Category;
    };
    vendor?: {
      data: Vendor;
    };
    reviews?: {
      data: Review[];
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Vendor {
  id: number;
  attributes: {
    storeName: string;
    storeDescription?: string;
    slug: string;
    logo?: {
      data: StrapiMediaData;
    };
    banner?: {
      data: StrapiMediaData;
    };
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
  };
}

export interface Review {
  id: number;
  attributes: {
    rating: number;
    title: string;
    comment: string;
    isVerifiedPurchase: boolean;
    isApproved: boolean;
    helpfulCount: number;
    images?: {
      data: StrapiMediaData[];
    };
    product?: {
      data: Product;
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface Order {
  id: number;
  attributes: {
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
  };
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