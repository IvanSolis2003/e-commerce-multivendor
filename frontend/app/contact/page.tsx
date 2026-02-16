export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contacto</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">iasm20.tech@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📱</span>
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <p className="text-gray-600">+56 9 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-2xl mr-3">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Dirección</p>
                    <p className="text-gray-600">Santiago, Chile</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Horario de Atención</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Lunes a Viernes:</span> 9:00 - 18:00</p>
                <p><span className="font-semibold">Sábados:</span> 10:00 - 14:00</p>
                <p><span className="font-semibold">Domingos:</span> Cerrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}