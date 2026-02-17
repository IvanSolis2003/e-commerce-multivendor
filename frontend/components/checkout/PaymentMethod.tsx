'use client';

import { useState } from 'react';

interface PaymentMethodProps {
  onSelect: (data: { paymentMethod: 'credit_card' | 'debit_card' | 'cash_on_delivery' }) => void;
  onBack: () => void;
  isProcessing: boolean;
  initialData?: { paymentMethod: 'credit_card' | 'debit_card' | 'cash_on_delivery' };
}

export function PaymentMethod({
  onSelect,
  onBack,
  isProcessing,
  initialData,
}: PaymentMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState(
    initialData?.paymentMethod || 'debit_card'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect({ paymentMethod: selectedMethod as 'credit_card' | 'debit_card' | 'cash_on_delivery' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tarjeta de Crédito */}
        <label
          className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
            selectedMethod === 'credit_card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={selectedMethod === 'credit_card'}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💳</span>
                <div>
                  <p className="font-semibold text-gray-900">Tarjeta de Crédito</p>
                  <p className="text-sm text-gray-600">
                    Visa, Mastercard, American Express
                  </p>
                </div>
              </div>
            </div>
          </div>
        </label>

        {/* Tarjeta de Débito */}
        <label
          className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
            selectedMethod === 'debit_card'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="debit_card"
              checked={selectedMethod === 'debit_card'}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💰</span>
                <div>
                  <p className="font-semibold text-gray-900">Tarjeta de Débito</p>
                  <p className="text-sm text-gray-600">Redcompra</p>
                </div>
              </div>
            </div>
          </div>
        </label>

        {/* PayPal - Próximamente */}
        <div className="block border-2 border-gray-200 rounded-lg p-4 opacity-50 cursor-not-allowed">
          <div className="flex items-center">
            <input type="radio" disabled className="w-4 h-4" />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🅿️</span>
                <div>
                  <p className="font-semibold text-gray-600">
                    PayPal{' '}
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Próximamente
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Paga de forma segura con tu cuenta PayPal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stripe - Próximamente */}
        <div className="block border-2 border-gray-200 rounded-lg p-4 opacity-50 cursor-not-allowed">
          <div className="flex items-center">
            <input type="radio" disabled className="w-4 h-4" />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💳</span>
                <div>
                  <p className="font-semibold text-gray-600">
                    Stripe{' '}
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Próximamente
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Procesador de pagos internacional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pago contra entrega */}
        <label
          className={`block border-2 rounded-lg p-4 cursor-pointer transition ${
            selectedMethod === 'cash_on_delivery'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="cash_on_delivery"
              checked={selectedMethod === 'cash_on_delivery'}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-4 h-4 text-indigo-600"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏠</span>
                <div>
                  <p className="font-semibold text-gray-900">Pago contra entrega</p>
                  <p className="text-sm text-gray-600">
                    Paga en efectivo cuando recibas tu pedido
                  </p>
                </div>
              </div>
            </div>
          </div>
        </label>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Volver
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Procesando...
              </span>
            ) : (
              'Confirmar Pedido'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}