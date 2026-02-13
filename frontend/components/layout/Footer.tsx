import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">🛍️ IASM20</h3>
            <p className="text-gray-400 text-sm">
              Tu marketplace de confianza con los mejores vendedores y productos de Chile.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white transition">
                  Vendedores
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help" className="hover:text-white transition">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white transition">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 IASM20-Shop. Todos los derechos reservados.</p>
          <p className="mt-2">
            Desarrollado por Iván Solís  usando Next.js y Strapi
          </p>
        </div>
      </div>
    </footer>
  );
}