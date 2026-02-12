'use client';

import { useState } from 'react';
import type { PaymentMethod as PaymentMethodType } from '@/types/checkout';

interface PaymentMethodProps {
  onSelect: (method: PaymentMethodType) => void;
  selectedMethod?: PaymentMethodType;
}

interface PaymentOption {
  id: PaymentMethodType;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'credit_card',
    name: 'Tarjeta de Crédito',
    description: 'Visa, Mastercard, American Express',
    icon: '💳',
    enabled: true,
  },
  {
    id: 'debit_card',
    name: 'Tarjeta de Débito',
    description: 'Redcompra',
    icon: '💰',
    enabled: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga de forma segura con tu cuenta PayPal',
    icon: '🅿️',
    enabled: false, // Deshabilitado por ahora
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Procesador de pagos internacional',
    icon: '💵',
    enabled: false, // Deshabilitado por ahora
  },
  {
    id: 'cash_on_delivery',
    name: 'Pago contra entrega',
    description: 'Paga en efectivo cuando recibas tu pedido',
    icon: '🏠',
    enabled: true,
  },
];

export function PaymentMethod({ onSelect, selectedMethod }: PaymentMethodProps) {
  const [selected, setSelected] = useState<PaymentMethodType | undefined>(selectedMethod);

  const handleSelect = (methodId: PaymentMethodType) => {
    setSelected(methodId);
    onSelect(methodId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Método de Pago
      </h2>

      <div className="space-y-3">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => option.enabled && handleSelect(option.id)}
            disabled={!option.enabled}
            className={`w-full p-4 rounded-lg border-2 text-left transition ${
              selected === option.id
                ? 'border-indigo-600 bg-indigo-50'
                : option.enabled
                ? 'border-gray-300 hover:border-indigo-300'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Radio button personalizado */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selected === option.id
                    ? 'border-indigo-600'
                    : 'border-gray-300'
                }`}
              >
                {selected === option.id && (
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                )}
              </div>

              {/* Icono */}
              <span className="text-3xl">{option.icon}</span>

              {/* Información */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{option.name}</p>
                  {!option.enabled && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Próximamente
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mensaje de seguridad */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-semibold text-green-800">Pago Seguro</p>
            <p className="text-sm text-green-700">
              Tus datos están protegidos con encriptación SSL de 256 bits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}