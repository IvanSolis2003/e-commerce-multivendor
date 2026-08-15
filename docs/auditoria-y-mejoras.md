# Auditoría del proyecto y mejoras recomendadas

Estado tras la migración de Railway a EC2 + Neon (agosto 2026). Los hallazgos
marcados como *verificado* se comprobaron ejecutándolos contra el sistema en
producción; los marcados como *por código* salen de la lectura del fuente y no
se probaron para no ensuciar datos reales.

---

## Seguridad

### 1. CRÍTICO — Las líneas de pedido son públicas

**Verificado.** El rol `public` tiene el permiso `api::order-item.order-item.find`:

```
GET https://api.ecommerce.iasmtech.com/api/order-items?populate=*
→ HTTP 200, 28 líneas de pedido, sin autenticación
```

Cualquiera en internet ve qué se vendió, a qué precio y en qué cantidad. Además
el controlador es el factory por defecto, **sin filtro por dueño**, así que un
usuario autenticado también ve las líneas de todos los demás.

El controlador de `order` sí filtra por usuario, pero ese trabajo queda anulado:
la misma información se obtiene por `order-items`.

**Arreglo:**
1. Quitar `find` del rol `public` en el panel de admin.
2. Escribir un controlador para `order-item` que filtre por el dueño del pedido,
   igual que hace `order`.

### 2. CRÍTICO — Los precios los pone el cliente

**Por código.** `order.create` construye el pedido con lo que llegue en el body:

```ts
const orderData = { ...data, users_permissions_user: user.documentId, publishedAt: new Date() };
```

No hay validación de ningún campo. Un atacante puede enviar `totalAmount: 0`,
`paymentStatus: "paid"` y `orderStatus: "delivered"` y el backend lo acepta. Lo
mismo aplica a `order-item`, donde `price` y `subtotal` vienen del cliente.

**Arreglo:** recalcular en el servidor. Leer los productos de la base por su id,
tomar de ahí el precio y el descuento, calcular subtotales y total, e ignorar
cualquier valor económico o de estado que mande el cliente.

### 3. ALTO — Los pedidos huérfanos son legibles por cualquier usuario

**Por código, con datos que lo hacen explotable.** En `order.findOne`:

```ts
const orderUserDocId = order.users_permissions_user?.documentId;
if (orderUserDocId && orderUserDocId !== user.documentId) {
  return ctx.forbidden('No tienes permiso para ver esta orden');
}
```

Si el pedido no tiene usuario asociado, `orderUserDocId` es `undefined` y **la
comprobación entera se salta**. Hay **14 pedidos sin dueño de un total de 24**,
así que cualquier usuario autenticado puede leer sus direcciones de envío,
teléfonos y nombres.

**Arreglo:** invertir la lógica, denegar cuando no hay dueño:

```ts
if (!orderUserDocId || orderUserDocId !== user.documentId) {
  return ctx.forbidden('No tienes permiso para ver esta orden');
}
```

### 4. MEDIO — Sin límite de peticiones

`login`, `register` y `forgotPassword` están abiertos sin throttling, expuestos a
fuerza bruta y a enumeración de cuentas. A los pocos minutos de levantar el
dominio ya aparecían escáneres automáticos en los logs de Caddy.

**Arreglo:** limitar por IP en Caddy, o el plugin `strapi-plugin-rate-limit`.

### 5. MEDIO — La conexión a la base no valida el certificado

`config/database.js` usa `ssl: { rejectUnauthorized: false }`. Se puso para
Railway, pero Neon presenta un certificado válido de una CA pública: desactivar
la validación solo abre la puerta a un intermediario.

**Arreglo:** `ssl: true` y comprobar que conecta.

### 6. MEDIO — El contenedor corre como root

`node:20-alpine` no define usuario, así que Strapi corre como `root` dentro del
contenedor. Cualquier ejecución de código arbitrario tiene privilegios máximos.

**Arreglo:** crear un usuario sin privilegios en el Dockerfile y `USER node`.

### 7. MENOR

- Rotar la clave SSH de la instancia, que se compartió por un canal no seguro.
- Restringir el puerto 22 del grupo de seguridad a una IP concreta.
- Auditar los 2 registros de `strapi_api_tokens` heredados del entorno anterior.
- `APP_KEYS` es una sola clave de 22 caracteres; Strapi espera una lista de
  cuatro para poder rotarlas sin cerrar todas las sesiones.

---

## Calidad

### 1. No hay tests ni integración continua

Cero archivos de test y ningún workflow en `.github/`. Cada despliegue depende de
comprobar a mano.

**Lo más rentable primero:** un workflow que en cada push ejecute `tsc --noEmit`
del backend y `next build` del frontend. Detecta la mayoría de las roturas sin
escribir un solo test. Después, tests de los controladores de `order`, que es
donde está la lógica de negocio y los fallos de seguridad de arriba.

### 2. La imagen Docker pesa 1.67 GB

La etapa final copia todo desde la etapa de build, incluidas `devDependencies` y
el toolchain de compilación (`gcc`, `build-base`, cabeceras de `vips`). Nada de
eso hace falta para ejecutar.

Con un `npm prune --omit=dev` antes de copiar, y copiando solo `dist`,
`node_modules`, `package.json` y `public`, la imagen debería quedar entre 400 y
500 MB. Importa especialmente hoy, porque la imagen se transfiere a mano a la
instancia en cada despliegue.

### 3. Despliegue manual

Como la t3.micro no puede compilar Strapi, cada cambio exige construir en local,
exportar, transferir y cargar. Un workflow de GitHub Actions que construya la
imagen y la publique en GHCR reduce el despliegue en la instancia a un `docker
compose pull && docker compose up -d`. Entra en el plan gratuito.

### 4. Documentación desordenada

- El `README.md` de la raíz es el genérico de Strapi, no describe el proyecto.
- `frontend/README.md` tiene pegado texto de tutorial a medio terminar
  ("PASO 4: Agregar .env.example", "¿Listo para el COMMIT FINAL?").

### 5. Detalles menores

- Avisos del Dockerfile: `as` debería ser `AS`, y `ENV PATH valor` debería usar
  el formato `ENV PATH=valor`.
- `ctx.throw(500, error)` en el controlador de `order` devuelve el error interno
  al cliente; conviene registrarlo y responder un mensaje genérico.
- El cliente de API del frontend usa `any` en varias funciones (`createOrder`,
  `createOrderItems`), lo que anula el tipado justo en la parte más delicada.

---

## Funcionalidad

### 1. El stock nunca se descuenta

No existe ningún lifecycle ni lógica que reduzca `stock` al confirmar un pedido.
Se pueden vender 100 unidades de un producto que tiene 25. Para una tienda es un
fallo de fondo, no un detalle.

**Arreglo:** descontar dentro de una transacción al crear el pedido, y rechazarlo
si no hay existencias suficientes.

### 2. La creación de pedidos no es atómica

El frontend llama primero a `createOrder` y después a `createOrderItems` en una
petición aparte. Si la segunda falla, queda un pedido sin líneas, cobrado y sin
contenido.

**Arreglo:** un único endpoint que reciba el carrito completo y cree pedido,
líneas y descuento de stock en una transacción.

### 3. 14 pedidos sin dueño

De los 24 pedidos, 14 no tienen usuario asociado: sus clientes no los ven en "Mis
pedidos" y solo aparecen en el panel de admin. Vienen de antes de la corrección
del controlador. Se pueden reasignar a mano cruzando el email del pedido con la
tabla de usuarios.

### 4. No hay cobro real

`paymentMethod` ofrece `stripe`, `paypal` y tarjetas, pero no existe integración
con ninguna pasarela: los pedidos se registran sin cobrar. Para Chile lo natural
sería Webpay de Transbank o Mercado Pago.

### 5. Los vendedores no tienen panel

Es la carencia más grande respecto a lo que promete el producto. Se llama
marketplace multivendedor, pero los vendedores no pueden entrar a gestionar sus
productos, ver sus ventas ni sus comisiones: todo pasa por el admin de Strapi.
El modelo de datos ya tiene `commission`, `totalSales` y `isApproved`, así que la
base está puesta y falta la capa de acceso.

### 6. Reseñas sin circuito completo

`isApproved` nace en `false` y no hay pantalla de moderación ni formulario claro
para dejar reseñas. Hoy hay 2 en total.

---

## Orden sugerido

| # | Tarea | Motivo |
|---|---|---|
| 1 | Cerrar `order-items` al público y filtrar por dueño | Fuga de datos activa |
| 2 | Calcular precios en el servidor | Permite pedidos a coste cero |
| 3 | Arreglar el guard de `findOne` | Expone direcciones de 14 pedidos |
| 4 | Descontar stock en transacción | Se vende lo que no existe |
| 5 | CI con `tsc` y `build` | Red de seguridad para todo lo demás |
| 6 | Adelgazar la imagen Docker | Hace el despliegue viable |
| 7 | Panel de vendedores | Completa la promesa del producto |

Los tres primeros son de seguridad y afectan a datos reales que ya están en
producción.
