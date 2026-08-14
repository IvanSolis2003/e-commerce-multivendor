export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Detras de un proxy inverso que termina el TLS (Caddy, nginx, ALB) Strapi
  // recibe la peticion por http plano. Sin confiar en las cabeceras
  // X-Forwarded-* se cree servido en http, genera redirecciones y URLs
  // absolutas con ese esquema, y el panel de admin falla al iniciar sesion.
  proxy: env.bool('IS_PROXIED', false),
  // URL publica del backend, p. ej. https://api.midominio.com
  url: env('PUBLIC_URL', undefined),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
