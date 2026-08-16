import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/contexts/CartContext";
import { AuthProvider } from "@/lib/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "IASM20-Shop - Marketplace Multivendor",
    template: "%s | E-Shop",
  },
  description: "Tu marketplace de confianza con los mejores vendedores y productos de calidad. Encuentra electrónicos, ropa, hogar y más en un solo lugar.",
  keywords: [
    "marketplace",
    "e-commerce",
    "multivendor",
    "tienda online",
    "productos",
    "Chile",
    "compras online",
    "vendedores",
    "electrónicos",
    "ropa",
    "hogar",
  ],
  authors: [{ name: "Iván Solís" }],
  creator: "E-Shop",
  publisher: "E-Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://e-shop.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://e-shop.com",
    siteName: "E-Shop",
    title: "E-Shop - Marketplace Multivendor",
    description: "Tu marketplace de confianza con los mejores vendedores y productos de calidad. Encuentra electrónicos, ropa, hogar y más.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "E-Shop Marketplace - Encuentra los mejores productos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Shop - Marketplace Multivendor",
    description: "Tu marketplace de confianza con los mejores vendedores y productos de calidad",
    images: ["/og-image.jpg"],
    creator: "@eshop",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Favicon adicionales para mejor compatibilidad */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className={inter.className}>
        {/* AuthProvider envuelve todo (más externo) */}
        <AuthProvider>
          {/* CartProvider puede usar useAuth si lo necesita */}
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        <Script
          src="https://iasm-pulse.vercel.app/track.js"
          data-site="ecommerce.iasmtech.com"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}