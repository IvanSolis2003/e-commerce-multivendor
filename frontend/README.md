# 🛍️ E-Shop - Marketplace Multivendor

E-commerce multivendor completo desarrollado con Next.js 16 y Strapi v5, con autenticación, carrito de compras, procesamiento de órdenes y más.

## 🚀 Características

### Frontend (Next.js 16)
- ✅ **Catálogo de productos** con filtros y búsqueda
- ✅ **Carrito de compras** persistente (localStorage)
- ✅ **Autenticación JWT** completa (registro, login, logout)
- ✅ **Checkout de 2 pasos** (envío y pago)
- ✅ **Gestión de órdenes** (listado, detalle, estados)
- ✅ **Perfil de usuario** con estadísticas
- ✅ **Búsqueda global** funcional
- ✅ **Páginas de categorías y vendedores**
- ✅ **Diseño responsive** (móvil, tablet, desktop)
- ✅ **Código modular** y reutilizable

### Backend (Strapi v5)
- ✅ **6 modelos** con relaciones (Product, Category, Vendor, Order, Order-Item, Review)
- ✅ **API REST** completa
- ✅ **PostgreSQL** como base de datos
- ✅ **Autenticación** integrada
- ✅ **Permisos** configurados

## 🛠️ Tecnologías

### Frontend
- Next.js 16.1.6 (App Router + Turbopack)
- TypeScript
- Tailwind CSS
- React Context API
- Axios

### Backend
- Strapi v5.35.0
- PostgreSQL 15
- Node.js v18+

## 📦 Instalación

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL 15
- Git

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/IvanSolis2003/e-commerce-multivendor.git
cd e-commerce-multivendor
\`\`\`

### 2. Configurar Backend (Strapi)
\`\`\`bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
# DATABASE_PASSWORD=tu_password_aqui

# Iniciar Strapi
npm run develop
\`\`\`

Strapi estará disponible en: http://localhost:1337/admin

### 3. Configurar Frontend (Next.js)
\`\`\`bash
cd frontend
npm install

# Crear archivo .env.local
cp .env.example .env.local

# Iniciar Next.js
npm run dev
\`\`\`

Frontend estará disponible en: http://localhost:3000

## 📚 Estructura del Proyecto

\`\`\`
e-commerce-multivendor/
├── backend/                  # Strapi Backend
│   ├── config/              # Configuración de Strapi
│   ├── database/            # Migraciones y seeds
│   ├── src/api/             # Modelos y controladores
│   │   ├── category/
│   │   ├── product/
│   │   ├── vendor/
│   │   ├── order/
│   │   ├── order-item/
│   │   └── review/
│   └── package.json
│
└── frontend/                 # Next.js Frontend
    ├── app/                 # App Router
    │   ├── products/
    │   ├── cart/
    │   ├── checkout/
    │   ├── orders/
    │   ├── categories/
    │   ├── vendors/
    │   ├── profile/
    │   └── login/
    ├── components/          # Componentes reutilizables
    │   ├── layout/
    │   ├── products/
    │   ├── cart/
    │   ├── checkout/
    │   ├── orders/
    │   └── common/
    ├── lib/                 # Utilidades
    │   ├── contexts/        # React Contexts
    │   ├── utils/           # Funciones helper
    │   └── api.ts           # Cliente API
    ├── types/               # TypeScript types
    └── package.json
\`\`\`

## 🎨 Características Destacadas

### Componentes Modulares
Todos los componentes están diseñados para ser reutilizables:
- ProductCard (con variantes compact y default)
- OrderCard
- CartItem
- OrderStatusBadge
- LoadingSkeleton
- Toast Notifications

### Arquitectura
- **Separación de responsabilidades**: UI, lógica de negocio y datos
- **TypeScript**: Tipado estricto en todo el proyecto
- **Context API**: Estado global para carrito y autenticación
- **Componentes < 150 líneas**: Código mantenible y testeable

## 📸 Screenshots

[Agregar screenshots de las páginas principales]

## 🚀 Deploy

### Backend (Strapi)
- Railway, Render, o DigitalOcean
- PostgreSQL en producción

### Frontend (Next.js)
- Vercel (recomendado)
- Netlify
- AWS Amplify

## 👨‍💻 Autor

**Iván Solís**
- GitHub: [@IvanSolis2003](https://github.com/IvanSolis2003)

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

Proyecto desarrollado como parte de la práctica profesional de Análisis y Programación.
\`\`\`

---

## 📝 **PASO 4: Agregar .env.example para documentación**
```bash
code frontend\.env.example
```

**Archivo: `frontend/.env.example`**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:1337

# App Configuration
NEXT_PUBLIC_APP_NAME=E-Shop
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---
```bash
code backend\.env.example
```

**Archivo: `backend/.env.example`**
```env
HOST=0.0.0.0
PORT=1337

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=ecommerce_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=tu_password_aqui
DATABASE_SSL=false

# Secrets
APP_KEYS=generado_automaticamente
API_TOKEN_SALT=generado_automaticamente
ADMIN_JWT_SECRET=generado_automaticamente
TRANSFER_TOKEN_SALT=generado_automaticamente
JWT_SECRET=generado_automaticamente
```

---

## ✅ **SEO y documentación completados:**

1. ✅ Meta tags completos (Open Graph, Twitter Card)
2. ✅ Favicon (usar emoji o generar uno)
3. ✅ README profesional y completo
4. ✅ .env.example para facilitar setup

---

**¿Listo para el COMMIT FINAL y alcanzar el 100%?** 🎉