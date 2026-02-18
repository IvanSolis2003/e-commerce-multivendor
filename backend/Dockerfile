# Multi-stage build for Strapi 5
FROM node:20-alpine as build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN rm -rf dist
RUN npm run build

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
