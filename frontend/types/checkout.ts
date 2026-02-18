// types/checkout.ts

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  additionalInfo?: string;
}

export type ShippingFormData = ShippingAddress;

export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  customerNotes?: string;
}

export interface OrderData {
  orderNumber: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  customerNotes?: string;
}