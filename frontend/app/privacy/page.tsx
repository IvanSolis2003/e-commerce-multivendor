export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
        <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
          <p className="text-gray-700 mb-4">
            Última actualización: {new Date().toLocaleDateString('es-CL')}
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Información que Recopilamos</h2>
          <p className="text-gray-700 mb-4">
            Recopilamos información que nos proporcionas directamente, como:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Nombre y dirección de correo electrónico</li>
            <li>Dirección de envío</li>
            <li>Información de pago</li>
            <li>Historial de compras</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso de la Información</h2>
          <p className="text-gray-700 mb-4">
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Procesar tus pedidos y pagos</li>
            <li>Enviarte confirmaciones y actualizaciones</li>
            <li>Mejorar nuestros servicios</li>
            <li>Personalizar tu experiencia</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Protección de Datos</h2>
          <p className="text-gray-700 mb-4">
            Implementamos medidas de seguridad para proteger tu información personal:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Encriptación SSL/TLS</li>
            <li>Servidores seguros</li>
            <li>Acceso restringido a datos personales</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Compartir Información</h2>
          <p className="text-gray-700 mb-4">
            No vendemos ni alquilamos tu información personal a terceros. Solo compartimos 
            información necesaria con:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Vendedores (solo información de envío)</li>
            <li>Procesadores de pago</li>
            <li>Servicios de envío</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Tus Derechos</h2>
          <p className="text-gray-700 mb-4">
            Tienes derecho a:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Acceder a tu información personal</li>
            <li>Corregir datos inexactos</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Oponerte al procesamiento de tus datos</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Contacto</h2>
          <p className="text-gray-700">
            Si tienes preguntas sobre esta política, contáctanos en: 
            <a href="mailto:iasm20.tech@gmail.com" className="text-indigo-600 hover:text-indigo-700">
              {' '}iasm20.tech@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}