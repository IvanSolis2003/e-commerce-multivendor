export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Información de Envíos</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Métodos de Envío</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🚚 Envío Estándar</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Tiempo de entrega:</span> 3-5 días hábiles
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Costo:</span> $2.990 CLP
              </p>
              <p className="text-gray-700">
                Disponible para todo Chile. Envío gratis en compras sobre $50.000.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">⚡ Envío Express</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Tiempo de entrega:</span> 1-2 días hábiles
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Costo:</span> $5.990 CLP
              </p>
              <p className="text-gray-700">
                Disponible para Región Metropolitana y principales ciudades.
              </p>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🏪 Retiro en Tienda</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Tiempo de preparación:</span> 24 horas
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Costo:</span> Gratis
              </p>
              <p className="text-gray-700">
                Retira tu pedido en nuestros puntos de retiro disponibles.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seguimiento de Pedido</h2>
          <p className="text-gray-700 mb-4">
            Una vez que tu pedido sea despachado, recibirás un correo electrónico con:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Número de seguimiento</li>
            <li>Link para rastrear tu envío</li>
            <li>Fecha estimada de entrega</li>
          </ul>
          <p className="text-gray-700">
            También puedes revisar el estado de tu pedido desde tu cuenta en la sección 
            "Mis Pedidos".
          </p>
        </div>
      </div>
    </div>
  );
}