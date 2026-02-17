'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/api';
import { isValidEmail } from '@/lib/utils/validation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validar email
        if (!isValidEmail(email)) {
            setError('Por favor, ingresa un correo electrónico válido');
            return;
        }

        setIsLoading(true);

        try {
            await forgotPassword(email.trim().toLowerCase());
            setIsSuccess(true);
        } catch (err: any) {
            console.error('Error en recuperación de contraseña:', err);
            // Por seguridad, a veces es mejor mostrar éxito aunque el correo no exista,
            // pero aquí seguiremos la lógica del backend.
            setError(err.message || 'Ocurrió un error al procesar tu solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Recuperar Contraseña
                        </h1>
                        <p className="text-gray-600">
                            Ingresa tu correo y te enviaremos las instrucciones
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="text-center">
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg">
                                <span className="text-4xl mb-4 block">📧</span>
                                <h2 className="text-xl font-bold mb-2">¡Correo enviado!</h2>
                                <p className="text-sm">
                                    Si el correo <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
                            >
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Enviando...
                                    </span>
                                ) : (
                                    'Enviar instrucciones'
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Regresar al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
