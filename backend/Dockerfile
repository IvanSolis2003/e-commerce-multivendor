FROM node:20-alpine as build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN rm -rf dist
RUN npm run build

# === CRÍTICO: Copiar manualmente archivos de configuración JS a dist/ ===
# Strapi build no copia archivos .js automáticamente si TypeScript está activo
RUN mkdir -p dist/config 
RUN cp config/database.js dist/config/database.js || echo "Aviso: config/database.js no encontrado"
RUN cp config/plugins.js dist/config/plugins.js || echo "Aviso: config/plugins.js no encontrado"

# === DIAGNÓSTICO FINAL ===
RUN echo "=== FILES IN dist/config/ ===" && ls -la dist/config/ 

FROM node:20-alpine
RUN apk add --no-cache vips-dev
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH /opt/app/node_modules/.bin:$PATH
ENV NODE_ENV=production
EXPOSE 1337
CMD ["npm", "run", "start"]
