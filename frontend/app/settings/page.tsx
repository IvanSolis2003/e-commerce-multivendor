'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('account');
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Protect route
    if (!isLoading && !isAuthenticated) {
        router.push('/login');
        return null;
    }

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setSuccessMsg('');

        // Simulating API call for settings update
        setTimeout(() => {
            setIsUpdating(false);
            setSuccessMsg('Configuración guardada correctamente.');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden md:flex">
                    {/* Sidebar Tabs */}
                    <div className="md:w-64 bg-gray-50 border-r border-gray-200 p-4 shrink-0">
                        <nav className="space-y-1">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition font-medium ${activeTab === 'account'
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>👤</span>
                                Cuenta
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition font-medium ${activeTab === 'notifications'
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>🔔</span>
                                Notificaciones
                            </button>
                            <button
                                onClick={() => setActiveTab('preferences')}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition font-medium ${activeTab === 'preferences'
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span>🛠️</span>
                                Preferencias
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 md:p-8 flex-1">
                        {successMsg && (
                            <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2">
                                <span>✓</span> {successMsg}
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles de la Cuenta</h2>
                                <form onSubmit={handleSave} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre de Usuario
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue={user.username}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                                disabled
                                            />
                                            <p className="text-xs text-gray-500 mt-1">El correo no puede ser cambiado.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Contraseña</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Nueva Contraseña
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="Dejar en blanco para no cambiar"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isUpdating && <span className="animate-spin text-xl">↻</span>}
                                            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferencias de Notificación</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition">
                                        <div>
                                            <p className="font-medium text-gray-900">Correos Promocionales</p>
                                            <p className="text-sm text-gray-500">Recibe ofertas y novedades.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition">
                                        <div>
                                            <p className="font-medium text-gray-900">Actualizaciones de Pedidos</p>
                                            <p className="text-sm text-gray-500">Notificaciones sobre el estado de tus compras.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferencias Generales</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Idioma Preferido
                                        </label>
                                        <select className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                                            <option value="es">Español</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Moneda
                                        </label>
                                        <select className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="ARS">ARS ($)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
