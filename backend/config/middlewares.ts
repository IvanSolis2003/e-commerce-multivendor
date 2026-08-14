export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    // Por defecto Strapi acepta peticiones de cualquier origen. En produccion
    // se restringe al dominio del frontend mediante CORS_ORIGINS, una lista
    // separada por comas. Sin la variable se mantiene '*', para no estorbar en
    // desarrollo local.
    name: 'strapi::cors',
    config: {
      origin: env('CORS_ORIGINS', '*')
        .split(',')
        .map((origen: string) => origen.trim())
        .filter(Boolean),
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
