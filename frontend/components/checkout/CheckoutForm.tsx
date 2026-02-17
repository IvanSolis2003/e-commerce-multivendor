'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ShippingForm } from './ShippingForm';
import { PaymentMethod } from './PaymentMethod';
import { OrderSummary } from './OrderSummary';
import { createOrder, createOrderItems } from '@/lib/api';
import type { ShippingAddress } from '@/types/checkout';

export function CheckoutForm() {
  const router = useRouter();
  const { items, isLoaded, getSubtotal, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref para evitar que el useEffect redirija a /cart cuando vaciamos el carrito
  // después de completar un pedido exitosamente
  const isOrderCompleteRef = useRef(false);

  // Datos del paso 1 (Shipping)
  const [step1Data, setStep1Data] = useState<ShippingAddress | null>(null);

  // Datos del paso 2 (Payment)
  const [step2Data, setStep2Data] = useState<{
    paymentMethod: 'credit_card' | 'debit_card' | 'cash_on_delivery';
  } | null>(null);

  // Redirigir si no está autenticado o si el carrito está vacío
  // IMPORTANTE: solo redirigir cuando isLoaded es true (ya cargó de localStorage)
  useEffect(() => {
    if (!isLoaded) return; // Esperar a que cargue
    if (isOrderCompleteRef.current) return; // No redirigir si el pedido fue completado
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else if (items.length === 0) {
      router.push('/cart');
    }
  }, [isAuthenticated, items.length, router, isLoaded]);

  // Mostrar loading mientras carga el carrito desde localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no hay items, no renderizar nada (está redirigiendo)
  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  // Calcular totales
  const subtotal = getSubtotal();
  const freeShippingThreshold = 50000;
  const hasDiscount = subtotal >= freeShippingThreshold;
  const discount = hasDiscount ? subtotal * 0.05 : 0;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 2990;
  const total = subtotal - discount + shippingCost;

  // Handler para el paso 1 (Shipping)
  const handleStep1Complete = (data: ShippingAddress) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  // Handler para el paso 2 (Payment)
  const handleStep2Complete = async (data: {
    paymentMethod: 'credit_card' | 'debit_card' | 'cash_on_delivery';
  }) => {
    setStep2Data(data);
    await processOrder(data);
  };

  // Procesar la orden
  const processOrder = async (paymentData: {
    paymentMethod: 'credit_card' | 'debit_card' | 'cash_on_delivery';
  }) => {
    if (!step1Data || !token) {
      alert('Datos incompletos');
      return;
    }

    setIsProcessing(true);

    try {
      // Generar número de orden único
      const generatedOrderNumber = `ORD-${Date.now()}`;

      // Crear la orden en Strapi
      const order = await createOrder(
        {
          orderNumber: generatedOrderNumber,
          orderStatus: 'pending',
          paymentStatus: 'pending',
          paymentMethod: paymentData.paymentMethod,
          shippingAddress: step1Data,
          subtotal,
          discount,
          tax: 0,
          shippingCost,
          totalAmount: total,
        },
        token
        // user?.id // Eliminado para evitar error 400
      );

      // Crear los items de la orden
      const orderItemsData = items.map((item) => ({
        orderId: order.id,
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku || '',
        quantity: item.quantity,
        price: item.product.price,
        discount: item.product.discount || 0,
        subtotal: item.product.price * item.quantity,
      }));

      await createOrderItems(orderItemsData, token);

      // Marcar que el pedido fue completado ANTES de vaciar el carrito
      // para que el useEffect no redirija a /cart
      isOrderCompleteRef.current = true;

      // Limpiar el carrito
      clearCart();

      // Redirigir a la página de confirmación
      router.push(`/order-confirmation?orderNumber=${generatedOrderNumber}`);
    } catch (error: any) {
      console.error('Error al procesar la orden:', error);
      const backendError = error?.response?.data?.error?.message || error?.message || 'Error desconocido';
      alert(`Hubo un error al procesar tu orden: ${backendError}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {/* Step 1 */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-300 text-gray-600'
                }`}
            >
              1
            </div>
            <span className="ml-2 font-medium text-gray-700">
              Información de Envío
            </span>
          </div>

          {/* Línea */}
          <div
            className={`w-24 h-1 mx-4 ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
          />

          {/* Step 2 */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-300 text-gray-600'
                }`}
            >
              2
            </div>
            <span className="ml-2 font-medium text-gray-700">
              Método de Pago
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formularios */}
        <div className="lg:col-span-2">
          {currentStep === 1 && (
            <ShippingForm
              onSubmit={handleStep1Complete}
              initialData={step1Data || undefined}
            />
          )}

          {currentStep === 2 && (
            <PaymentMethod
              onSelect={handleStep2Complete}
              onBack={() => setCurrentStep(1)}
              isProcessing={isProcessing}
              initialData={step2Data || undefined}
            />
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}