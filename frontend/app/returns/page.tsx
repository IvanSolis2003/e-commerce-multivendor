export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Política de Devoluciones</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Condiciones Generales</h2>
          <p className="text-gray-700 mb-4">
            En E-Shop queremos que estés 100% satisfecho con tu compra. Si no es así, 
            puedes devolver productos siguiendo estas condiciones:
          </p>
          
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
            <li>Tienes 30 días desde la recepción del producto</li>
            <li>El producto debe estar en condiciones originales</li>
            <li>Con etiquetas y empaque original</li>
            <li>Sin signos de uso o daño</li>
            <li>Incluir factura o comprobante de compra</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cómo Hacer una Devolución</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Solicita la devolución</h3>
                <p className="text-gray-700">
                  Desde tu cuenta, en "Mis Pedidos", selecciona el producto y solicita la devolución.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Prepara el paquete</h3>
                <p className="text-gray-700">
                  Empaca el producto en su caja original con todos los accesorios.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Envía el producto</h3>
                <p className="text-gray-700">
                  Recibirás una etiqueta de envío por correo. Despacha el paquete.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Recibe tu reembolso</h3>
                <p className="text-gray-700">
                  Una vez recibido y verificado, procesaremos el reembolso en 5-7 días hábiles.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Productos No Retornables</h2>
          <p className="text-gray-700 mb-4">
            Por razones de higiene y seguridad, los siguientes productos no son retornables:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Productos de higiene personal</li>
            <li>Ropa interior y trajes de baño</li>
            <li>Productos perecederos</li>
            <li>Productos personalizados o hechos a medida</li>
            <li>Software y productos digitales descargados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}