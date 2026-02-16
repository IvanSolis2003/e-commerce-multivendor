export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Términos y Condiciones</h1>
        <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
          <p className="text-gray-700 mb-4">Última actualización: {new Date().toLocaleDateString('es-CL')}</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceptación de Términos</h2>
          <p className="text-gray-700">
            Al acceder y utilizar E-Shop, aceptas estar sujeto a estos términos y condiciones.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso de la Plataforma</h2>
          <p className="text-gray-700">
            E-Shop es una plataforma de marketplace que conecta compradores con vendedores.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Responsabilidades</h2>
          <p className="text-gray-700">
            Los usuarios son responsables de mantener la confidencialidad de sus cuentas.
          </p>
        </div>
      </div>
    </div>
  );
}