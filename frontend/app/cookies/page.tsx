export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Cookies</h1>
        <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
          <p className="text-gray-700 mb-4">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Qué son las Cookies?</h2>
          <p className="text-gray-700 mb-4">
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
            cuando visitas nuestro sitio web. Nos ayudan a mejorar tu experiencia y 
            proporcionar funcionalidades personalizadas.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tipos de Cookies que Utilizamos</h2>
          
          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Cookies Esenciales</h3>
          <p className="text-gray-700 mb-4">
            Necesarias para el funcionamiento del sitio:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Autenticación de usuario</li>
            <li>Carrito de compras</li>
            <li>Seguridad</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Cookies de Rendimiento</h3>
          <p className="text-gray-700 mb-4">
            Nos ayudan a entender cómo los visitantes interactúan con el sitio:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Análisis de tráfico</li>
            <li>Páginas más visitadas</li>
            <li>Tiempo de permanencia</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Cookies de Funcionalidad</h3>
          <p className="text-gray-700 mb-4">
            Mejoran tu experiencia recordando tus preferencias:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Idioma preferido</li>
            <li>Preferencias de visualización</li>
            <li>Configuración de cuenta</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Gestionar Cookies</h2>
          <p className="text-gray-700 mb-4">
            Puedes controlar y/o eliminar las cookies según desees. Puedes eliminar todas 
            las cookies que ya están en tu dispositivo y configurar la mayoría de los 
            navegadores para evitar que se instalen.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contacto</h2>
          <p className="text-gray-700">
            Si tienes preguntas sobre nuestra política de cookies, contáctanos en: 
            <a href="mailto:iasm20.tech@gmail.com" className="text-indigo-600 hover:text-indigo-700">
              {' '}iasm20.tech@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}