// lib/utils/validation.ts

export interface ValidationError {
  field: string;
  message: string;
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar teléfono (Chile)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+56)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validar código postal
export function isValidZipCode(zipCode: string): boolean {
  return zipCode.length >= 4 && zipCode.length <= 10;
}

// Validar formulario de envío completo
export function validateShippingForm(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.push({ field: 'fullName', message: 'El nombre completo debe tener al menos 3 caracteres' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Ingrese un email válido' });
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Ingrese un teléfono válido' });
  }

  if (!data.street || data.street.trim().length < 5) {
    errors.push({ field: 'street', message: 'La dirección debe tener al menos 5 caracteres' });
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.push({ field: 'city', message: 'Ingrese una ciudad válida' });
  }

  if (!data.state || data.state.trim().length < 2) {
    errors.push({ field: 'state', message: 'Ingrese una región válida' });
  }

  if (!data.zipCode || !isValidZipCode(data.zipCode)) {
    errors.push({ field: 'zipCode', message: 'Ingrese un código postal válido' });
  }

  if (!data.country || data.country.trim().length < 2) {
    errors.push({ field: 'country', message: 'Ingrese un país válido' });
  }

  return errors;
}