// ============================================================
// Validación de Email
// ============================================================
export function isValidEmail(email: string): boolean {
  // Regex robusta para email
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Validaciones adicionales
  if (!email || email.length > 254) return false;
  if (email.includes('..')) return false; // No permite puntos consecutivos
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return emailRegex.test(email);
}

// ============================================================
// Validación de Contraseña Fuerte
// ============================================================
export function isStrongPassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Longitud mínima
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  // Longitud máxima (prevenir ataques DoS)
  if (password.length > 128) {
    errors.push('La contraseña no puede tener más de 128 caracteres');
  }

  // Al menos una mayúscula
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una letra mayúscula');
  }

  // Al menos una minúscula
  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una letra minúscula');
  }

  // Al menos un número
  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número');
  }

  // Al menos un carácter especial
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Debe incluir al menos un carácter especial (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================
// Validación de Nombre de Usuario
// ============================================================
export function isValidUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  // Solo letras, números, guiones y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;

  if (!username) {
    return { isValid: false, error: 'El nombre de usuario es requerido' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Mínimo 3 caracteres' };
  }

  if (username.length > 30) {
    return { isValid: false, error: 'Máximo 30 caracteres' };
  }

  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error: 'Solo letras, números, guiones y guiones bajos',
    };
  }

  // No puede empezar o terminar con guión
  if (username.startsWith('-') || username.endsWith('-')) {
    return {
      isValid: false,
      error: 'No puede empezar o terminar con guión',
    };
  }

  return { isValid: true };
}

// ============================================================
// Validación de Teléfono
// ============================================================
export function isValidPhone(phone: string): boolean {
  // Formato chileno: +56912345678 o 912345678
  const phoneRegex = /^(\+?56)?[2-9]\d{8}$/;
  
  // Remover espacios y guiones
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  return phoneRegex.test(cleanPhone);
}

// ============================================================
// Validación de Código Postal
// ============================================================
export function isValidZipCode(zipCode: string): boolean {
  // 4-10 dígitos, solo números
  const zipRegex = /^\d{4,10}$/;
  return zipRegex.test(zipCode);
}

// ============================================================
// Sanitización de Texto (Prevención XSS)
// ============================================================
export function sanitizeText(text: string): string {
  // Reemplazar caracteres peligrosos
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ============================================================
// Validación de Nombre Completo
// ============================================================
export function isValidFullName(name: string): {
  isValid: boolean;
  error?: string;
} {
  // Solo letras, espacios, acentos y guiones
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;

  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Mínimo 2 caracteres' };
  }

  if (name.length > 100) {
    return { isValid: false, error: 'Máximo 100 caracteres' };
  }

  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: 'Solo letras, espacios y guiones',
    };
  }

  return { isValid: true };
}

// ============================================================
// Validación de Dirección
// ============================================================
export function isValidAddress(address: string): {
  isValid: boolean;
  error?: string;
} {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'La dirección es requerida' };
  }

  if (address.length < 5) {
    return { isValid: false, error: 'Mínimo 5 caracteres' };
  }

  if (address.length > 200) {
    return { isValid: false, error: 'Máximo 200 caracteres' };
  }

  return { isValid: true };
}

// ============================================================
// Validación Completa del Formulario de Registro
// ============================================================
export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRegistrationForm(data: RegistrationData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar username
  const usernameValidation = isValidUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.push({
      field: 'username',
      message: usernameValidation.error || 'Nombre de usuario inválido',
    });
  }

  // Validar email
  if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Email inválido',
    });
  }

  // Validar contraseña
  const passwordValidation = isStrongPassword(data.password);
  if (!passwordValidation.isValid) {
    errors.push({
      field: 'password',
      message: passwordValidation.errors[0], // Mostrar primer error
    });
  }

  // Validar contraseñas coinciden
  if (data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Las contraseñas no coinciden',
    });
  }

  return errors;
}

// ============================================================
// Validación del Formulario de Envío
// ============================================================
export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function validateShippingForm(data: ShippingFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar nombre completo
  const nameValidation = isValidFullName(data.fullName);
  if (!nameValidation.isValid) {
    errors.push({
      field: 'fullName',
      message: nameValidation.error || 'Nombre inválido',
    });
  }

  // Validar email
  if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Email inválido',
    });
  }

  // Validar teléfono
  if (!isValidPhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Teléfono inválido (formato: +56912345678)',
    });
  }

  // Validar dirección
  const addressValidation = isValidAddress(data.street);
  if (!addressValidation.isValid) {
    errors.push({
      field: 'street',
      message: addressValidation.error || 'Dirección inválida',
    });
  }

  // Validar ciudad
  if (!data.city || data.city.trim().length < 2) {
    errors.push({
      field: 'city',
      message: 'Ciudad inválida',
    });
  }

  // Validar región/estado
  if (!data.state || data.state.trim().length < 2) {
    errors.push({
      field: 'state',
      message: 'Región inválida',
    });
  }

  // Validar código postal
  if (!isValidZipCode(data.zipCode)) {
    errors.push({
      field: 'zipCode',
      message: 'Código postal inválido',
    });
  }

  // Validar país
  if (!data.country || data.country.trim().length < 2) {
    errors.push({
      field: 'country',
      message: 'País inválido',
    });
  }

  return errors;
}