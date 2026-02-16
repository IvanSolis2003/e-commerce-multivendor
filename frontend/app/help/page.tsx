import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Centro de Ayuda</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <a href="/help#orders" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">📦</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pedidos</h2>
            <p className="text-gray-600">
              Información sobre cómo realizar, seguir y gestionar tus pedidos.
            </p>
          </a>

          <a href="/help#shipping" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">🚚</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Envíos</h2>
            <p className="text-gray-600">
              Detalles sobre métodos de envío, tiempos de entrega y seguimiento.
            </p>
          </a>

          <a href="/help#returns" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">↩️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Devoluciones</h2>
            <p className="text-gray-600">
              Política de devoluciones y cómo procesar un reembolso.
            </p>
          </a>

          <a href="/help#payment" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-3">💳</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pagos</h2>
            <p className="text-gray-600">
              Métodos de pago aceptados y seguridad en transacciones.
            </p>
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cómo puedo rastrear mi pedido?</h3>
              <p className="text-gray-700">
                Puedes rastrear tu pedido desde tu cuenta, en la sección "Mis Pedidos". 
                También recibirás un correo con el número de seguimiento.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cuáles son los métodos de pago?</h3>
              <p className="text-gray-700">
                Aceptamos tarjetas de crédito, débito, PayPal y pago contra entrega en 
                algunas zonas.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Cuánto tiempo tarda el envío?</h3>
              <p className="text-gray-700">
                El tiempo de envío varía según tu ubicación y el método seleccionado. 
                Generalmente entre 2-5 días hábiles.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Puedo devolver un producto?</h3>
              <p className="text-gray-700">
                Sí, tienes 30 días desde la recepción para devolver productos en condiciones 
                originales. Consulta nuestra política de devoluciones para más detalles.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">¿No encuentras lo que buscas?</h3>
            <p className="text-gray-700 mb-4">
              Nuestro equipo de soporte está aquí para ayudarte.
            </p>
            
            <Link
              href="/contact"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Contactar Soporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
