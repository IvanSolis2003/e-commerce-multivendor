# Multi-stage build for Strapi 5
FROM node:20-alpine as build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN rm -rf dist
# V8 fija el limite de heap segun la RAM fisica de la maquina e ignora el swap.
# En instancias pequenas (t3.micro, 1 GB) la compilacion del panel de admin
# supera ese tope y muere con "Reached heap limit". Subirlo a mano lo resuelve;
# el exceso sobre la RAM disponible lo absorbe el swap.
RUN NODE_OPTIONS=--max-old-space-size=1536 npm run build

# Copiar manualmente archivos de configuración JS a dist/ (necesario para Strapi 5 + Docker)
RUN mkdir -p dist/config 
RUN cp config/database.js dist/config/database.js
RUN cp config/plugins.js dist/config/plugins.js

FROM node:20-alpine
RUN apk add --no-cache vips-dev
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH /opt/app/node_modules/.bin:$PATH
ENV NODE_ENV=production
EXPOSE 1337
CMD ["npm", "run", "start"]
