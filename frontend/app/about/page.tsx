export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Acerca de E-Shop</h1>
        <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            E-Shop es tu marketplace de confianza donde encontrarás los mejores productos
            de vendedores verificados en Chile.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Nuestra Misión</h2>
          <p className="text-gray-700 mb-4">
            Conectar compradores con vendedores de calidad, ofreciendo una plataforma
            segura, confiable y fácil de usar.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Por qué E-Shop?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Vendedores verificados y confiables</li>
            <li>Amplia variedad de productos</li>
            <li>Proceso de compra seguro</li>
            <li>Atención al cliente dedicada</li>
            <li>Envíos a todo Chile</li>
          </ul>
        </div>
      </div>
    </div>
  );
}