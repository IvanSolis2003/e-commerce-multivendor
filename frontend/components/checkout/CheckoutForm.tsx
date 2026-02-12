'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/contexts/CartContext';
import { ShippingForm } from './ShippingForm';
import { PaymentMethod } from './PaymentMethod';
import { OrderSummary } from './OrderSummary';
import type { ShippingAddress, PaymentMethod as PaymentMethodType } from '@/types/checkout';
import { generateOrderNumber } from '@/lib/utils/format';

export function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, clearCart } = useCart();

  // Estado del checkout
  const [step, setStep] = useState(1); // 1: Envío, 2: Pago
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Manejar envío del formulario de dirección
  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);
    setStep(2); // Pasar al paso de pago
  };

  // Manejar selección de método de pago
  const handlePaymentSelect = (method: PaymentMethodType) => {
    setPaymentMethod(method);
  };

  // Procesar la orden
  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) {
      alert('Por favor completa todos los pasos');
      return;
    }

    setIsProcessing(true);

    try {
      // Preparar datos de la orden
      const orderData = {
        orderNumber: generateOrderNumber(),
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSku: item.product.sku || '',
          quantity: item.quantity,
          price: item.product.price || 0,
          discount: item.product.discount || 0,
        })),
        shippingAddress,
        paymentMethod,
        paymentStatus: 'pending' as const,
        orderStatus: 'pending' as const,
        subtotal: getSubtotal(),
        discount: getSubtotal() - getTotal(),
        shippingCost: 0,
        tax: 0,
        totalAmount: getTotal(),
      };

      // TODO: Aquí irá la llamada a la API de Strapi para crear la orden
      // Por ahora solo simulamos el proceso
      console.log('Orden creada:', orderData);

      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Limpiar carrito
      clearCart();

      // Redirigir a página de confirmación
      router.push(`/order-confirmation?orderNumber=${orderData.orderNumber}`);
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      alert('Hubo un error al procesar tu orden. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Si el carrito está vacío, mostrar mensaje
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tu carrito está vacío
        </h2>
        <p className="text-gray-600 mb-6">
          Agrega productos para continuar con el checkout
        </p>
        <button
          onClick={() => router.push('/products')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Ver Productos
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna izquierda - Formularios */}
      <div className="lg:col-span-2 space-y-6">
        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Paso 1: Envío */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step > 1 ? '✓' : '1'}
            </div>
            <span
              className={`ml-2 font-medium ${
                step >= 1 ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Envío
            </span>
          </div>

          {/* Línea conectora */}
          <div className="w-20 h-1 bg-gray-300"></div>

          {/* Paso 2: Pago */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
            <span
              className={`ml-2 font-medium ${
                step >= 2 ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Pago
            </span>
          </div>
        </div>

        {/* Paso 1: Formulario de Envío */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ShippingForm
              onSubmit={handleShippingSubmit}
              initialData={shippingAddress || undefined}
            />
          </div>
        )}

        {/* Paso 2: Método de Pago */}
        {step === 2 && (
          <>
            {/* Resumen de dirección */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Dirección de Envío
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Editar
                </button>
              </div>
              {shippingAddress && (
                <div className="text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">
                    {shippingAddress.fullName}
                  </p>
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                  <p className="mt-2">📧 {shippingAddress.email}</p>
                  <p>📱 {shippingAddress.phone}</p>
                  {shippingAddress.additionalInfo && (
                    <p className="text-sm italic mt-2">
                      ℹ️ {shippingAddress.additionalInfo}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Selector de método de pago */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <PaymentMethod
                onSelect={handlePaymentSelect}
                selectedMethod={paymentMethod || undefined}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                ← Volver
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={!paymentMethod || isProcessing}
                className={`flex-1 py-4 rounded-lg font-semibold transition ${
                  !paymentMethod || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Procesando...
                  </span>
                ) : (
                  'Realizar Pedido'
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Columna derecha - Resumen */}
      <div className="lg:col-span-1">
        <OrderSummary />
      </div>
    </div>
  );
}