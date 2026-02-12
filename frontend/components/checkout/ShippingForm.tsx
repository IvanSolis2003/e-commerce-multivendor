'use client';

import { useState } from 'react';
import type { ShippingAddress } from '@/types/checkout';
import { validateShippingForm, ValidationError } from '@/lib/utils/validation';

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
  initialData?: Partial<ShippingAddress>;
}

export function ShippingForm({ onSubmit, initialData }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || '',
    country: initialData?.country || 'Chile',
    additionalInfo: initialData?.additionalInfo || '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateShippingForm(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Si no hay errores, enviar datos
    onSubmit(formData);
  };

  // Helper para obtener el mensaje de error de un campo
  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Información de Envío
        </h2>

        <div className="space-y-4">
          {/* Nombre completo */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                getFieldError('fullName') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Juan Pérez González"
            />
            {getFieldError('fullName') && (
              <p className="mt-1 text-sm text-red-500">{getFieldError('fullName')}</p>
            )}
          </div>

          {/* Email y Teléfono en una fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  getFieldError('email') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="correo@ejemplo.com"
              />
              {getFieldError('email') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('email')}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  getFieldError('phone') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+56912345678"
              />
              {getFieldError('phone') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('phone')}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                getFieldError('street') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Av. Libertador Bernardo O'Higgins 1234"
            />
            {getFieldError('street') && (
              <p className="mt-1 text-sm text-red-500">{getFieldError('street')}</p>
            )}
          </div>

          {/* Ciudad, Región, Código Postal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  getFieldError('city') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Santiago"
              />
              {getFieldError('city') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('city')}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Región *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  getFieldError('state') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Región Metropolitana"
              />
              {getFieldError('state') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('state')}</p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  getFieldError('zipCode') ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="8320000"
              />
              {getFieldError('zipCode') && (
                <p className="mt-1 text-sm text-red-500">{getFieldError('zipCode')}</p>
              )}
            </div>
          </div>

          {/* País */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              País *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                getFieldError('country') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Chile"
            />
            {getFieldError('country') && (
              <p className="mt-1 text-sm text-red-500">{getFieldError('country')}</p>
            )}
          </div>

          {/* Información adicional (opcional) */}
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
              Información Adicional (Opcional)
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ej: Departamento 302, tocar timbre, etc."
            />
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Continuar al Pago
      </button>
    </form>
  );
}