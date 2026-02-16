'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: "Compras y Pagos",
      questions: [
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos tarjetas de crédito (Visa, Mastercard), tarjetas de débito, PayPal y pago contra entrega en zonas seleccionadas."
        },
        {
          q: "¿Es seguro comprar en E-Shop?",
          a: "Sí, utilizamos encriptación SSL y cumplimos con los estándares de seguridad PCI DSS. Tu información está protegida."
        },
        {
          q: "¿Puedo cambiar o cancelar mi pedido?",
          a: "Puedes cancelar tu pedido hasta que sea despachado. Contáctanos lo antes posible si necesitas hacer cambios."
        }
      ]
    },
    {
      category: "Envíos y Entregas",
      questions: [
        {
          q: "¿Cuánto tarda el envío?",
          a: "El envío estándar tarda 3-5 días hábiles. El envío express 1-2 días hábiles en zonas disponibles."
        },
        {
          q: "¿Hacen envíos a todo Chile?",
          a: "Sí, realizamos envíos a todo el territorio nacional. Los tiempos pueden variar según la zona."
        },
        {
          q: "¿Cómo rastreo mi pedido?",
          a: "Recibirás un correo con el número de seguimiento. También puedes verlo en 'Mis Pedidos' en tu cuenta."
        }
      ]
    },
    {
      category: "Devoluciones y Garantía",
      questions: [
        {
          q: "¿Cuál es la política de devoluciones?",
          a: "Tienes 30 días para devolver productos en condiciones originales. Consulta nuestra política completa."
        },
        {
          q: "¿Cómo solicito un reembolso?",
          a: "Desde 'Mis Pedidos' puedes solicitar la devolución. Procesamos reembolsos en 5-7 días hábiles."
        },
        {
          q: "¿Los productos tienen garantía?",
          a: "Sí, todos los productos cuentan con garantía del fabricante. El tiempo varía según el producto."
        }
      ]
    },
    {
      category: "Cuenta y Seguridad",
      questions: [
        {
          q: "¿Cómo creo una cuenta?",
          a: "Haz clic en 'Registrarse' en la esquina superior derecha y completa el formulario con tu información."
        },
        {
          q: "Olvidé mi contraseña, ¿qué hago?",
          a: "En la página de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?' y sigue las instrucciones."
        },
        {
          q: "¿Cómo actualizo mi información?",
          a: "Ve a tu perfil y haz clic en 'Editar' para actualizar tu información personal."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h1>
        <p className="text-lg text-gray-600 mb-8">
          Encuentra respuestas a las preguntas más comunes sobre E-Shop
        </p>

        <div className="space-y-6">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openIndex === index;

                  return (
                    <div key={qIndex}>
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        <span className="text-gray-400 text-xl">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-gray-700">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿No encontraste tu respuesta?</h2>
          <p className="text-gray-700 mb-6">
            Nuestro equipo de soporte está listo para ayudarte
          </p>

          <Link
            href="/contact"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Contactar Soporte
          </Link>
        </div>
      </div>
    </div>
  );
}
