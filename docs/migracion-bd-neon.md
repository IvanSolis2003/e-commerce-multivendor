# Migración de la base de datos a Neon

Procedimiento para levantar la base del proyecto en Neon (PostgreSQL serverless),
saliendo de Railway.

## Situación de partida

| Origen | Estado |
|---|---|
| Postgres de Railway (`railway` @ `gondola.proxy.rlwy.net:25113`) | **Inaccesible.** El proxy acepta TCP pero el servidor cierra la conexión de inmediato en cualquier `sslmode`. |
| `backend/backup.dump` | **Válido.** Formato CUSTOM, gzip, generado con pg_dump 17.7 desde la base local `ecommerce_db` el 18-02-2026. |
| Postgres local (`localhost:5432`) | Corriendo, pero la contraseña del `.env` es la de Railway, no la local. |

### Por qué está caído Railway

El proyecto `proactive-patience` tiene el **trial expirado**, así que Railway
suspendió los servicios: el Postgres figura como *Service is offline* y los
deploys están bloqueados. No es un contenedor caído, no hay redeploy que lo
levante.

El volumen `postgres-volume` **sigue adjunto**, o sea que los datos no se
borraron: están tras el muro de pago. Reactivarlos exige contratar el plan Hobby.
Railway elimina los datos de proyectos con trial expirado pasado un tiempo, así
que esa ventana no es indefinida.

> Ojo: `backup.dump` es de `ecommerce_db` (local), **no** de `railway`. Cualquier
> dato generado en producción después del 18-02-2026 solo existe en el volumen de
> Railway.

### Decisión tomada

Se descartó pagar el plan Hobby para rescatar el volumen. **Se migra a Neon con el
respaldo del 18-02-2026**, asumiendo la pérdida de lo que se haya generado en
producción después de esa fecha. El respaldo contiene un dataset completo y
coherente, incluidos los permisos de Strapi, que es la parte cara de reconstruir.

## Contenido del respaldo

Datos de negocio: 8 productos, 6 categorías, 6 vendedores, 48 pedidos,
56 líneas de pedido, 11 usuarios, 4 reseñas, 2 solicitudes de vendedor.

Configuración de Strapi: 35 registros en `up_permissions`, 2 roles públicos,
1 usuario admin, 3 roles de admin, 2 API tokens, 13 referencias de archivos
a Cloudinary.

Los `up_permissions` son lo más importante: los permisos de la API viven en la
base de datos, no en el código. Partir de una base vacía obliga a reconfigurarlos
a mano en el panel de admin.

## Compatibilidad con Neon

Verificado sobre el dump:

- No requiere extensiones.
- No crea esquemas propios, todo va en `public`.
- No contiene `CREATE DATABASE` (es un dump de una sola base).
- Los objetos pertenecen al rol `postgres`, que **no existe en Neon** (allí el rol
  es `neondb_owner`). Por eso hay que restaurar con `--no-owner --no-privileges`.
- Neon corre **PostgreSQL 18.4** y el dump se generó con 17.7. Restaurar un dump
  más antiguo en un servidor más nuevo es una operación soportada y se completó
  sin incidentes.

## Restauración

Las herramientas de cliente están en `C:\Program Files\PostgreSQL\17\bin`, fuera
del PATH. En Git Bash:

```bash
export PATH="/c/Program Files/PostgreSQL/17/bin:$PATH"
```

### Endpoint directo, no el pooled

Neon entrega dos endpoints: el *pooled* (host con sufijo `-pooler`, detrás de
PgBouncer) y el *directo*. **La restauración va contra el directo.**

Se intentó primero contra el pooled y el resultado fue engañoso: `pg_restore`
terminó con código de salida 0 y creó las 53 tablas, pero las consultas de
verificación a través del pooler no veían los objetos recién creados y devolvían
`relation "orders" does not exist`. Repetida contra el endpoint directo, la
operación se completó y verificó sin problemas.

El pooled sí es el adecuado para `DATABASE_URL` de la aplicación en marcha.

Con la cadena de conexión que entrega Neon (incluye `?sslmode=require`):

```bash
NEON_URL='postgresql://neondb_owner:PASSWORD@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require'

pg_restore \
  --no-owner \
  --no-privileges \
  --if-exists --clean \
  --dbname "$NEON_URL" \
  backend/backup.dump
```

- `--no-owner --no-privileges`: ignora el rol `postgres` del origen.
- `--if-exists --clean`: hace la operación repetible; si un intento falla a medias,
  se puede volver a correr sin residuos. **Borra los objetos existentes**, así que
  no lo uses contra una base con datos que quieras conservar.

Verificación posterior:

```bash
psql "$NEON_URL" -c "select count(*) from products;"    # espera 8
psql "$NEON_URL" -c "select count(*) from orders;"      # espera 48
psql "$NEON_URL" -c "select count(*) from up_permissions;"  # espera 35
```

## Resultado de la restauración

Ejecutada y verificada. Las 11 tablas comprobadas cuadran exactamente con el
respaldo: 8 productos, 6 categorías, 6 vendedores, 48 pedidos, 56 líneas de
pedido, 11 usuarios, 4 reseñas, 35 permisos, 2 roles, 13 archivos y 2 solicitudes
de vendedor.

Comprobaciones adicionales:

- **Secuencias correctas.** Todas quedaron con `is_called = true` y su valor
  alineado con el `max(id)` de su tabla. Verificado con un `nextval` real dentro
  de una transacción revertida: la secuencia de productos entrega 14 y el id
  máximo es 13, así que los INSERT nuevos no colisionan.
- **Usuario admin recuperado:** `ivan.solis20.m@gmail.com`, activo y no bloqueado.
  Entra al panel con su contraseña de siempre, porque el hash viaja en el dump.
- **Permisos repartidos:** 18 en el rol `Public` y 17 en `Authenticated`.
- **Relaciones íntegras:** los 8 productos conservan su vendedor.

### Un dato preexistente, no un fallo de la migración

**28 de los 48 pedidos no tienen usuario asociado** (solo 20 filas en
`orders_users_permissions_user_lnk`). No es un error de la restauración: el
respaldo ya venía así, y el conteo se replicó exacto.

Son pedidos anteriores a la corrección del controlador que asocia el usuario
autenticado a la orden. Como `order.find` filtra por usuario, esos 28 pedidos no
los ve nadie desde "Mis pedidos"; solo aparecen en el panel de admin. Si se
quieren recuperar, hay que reasignarlos a mano.

## Cambios en la aplicación

1. **`DATABASE_URL`** en el nuevo host del backend → cadena de Neon.
   `backend/config/database.js` ya lee solo `DATABASE_URL` y usa
   `ssl.rejectUnauthorized: false`, compatible con Neon sin tocar código.

2. **Pool de conexiones.** Resuelto en la rama `fix/pool-bd-para-neon`: `pool.min`
   pasa de 2 a 0. Con `min: 2` el pool mantenía conexiones abiertas de forma
   permanente, la base nunca se dormía y se consumía cómputo las 24 h. Conviene
   además apuntar `DATABASE_URL` al endpoint *pooled* (el host con sufijo
   `-pooler`).

3. **Secretos.** Copiar sin regenerar desde `backend/.env`: `APP_KEYS`,
   `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`,
   `JWT_SECRET`. Si cambian, se invalidan las sesiones y los datos cifrados que
   vienen en el respaldo.

4. **Cloudinary.** Las imágenes no están en la base ni en el disco del servidor:
   viven en Cloudinary y la tabla `files` solo guarda las URLs. Basta con mantener
   `CLOUDINARY_NAME`, `CLOUDINARY_KEY` y `CLOUDINARY_SECRET`.

5. **`NEXT_PUBLIC_API_URL`** en Vercel → URL del backend nuevo. Es variable de
   build, así que exige redesplegar el frontend.

## Si se recupera Railway

Si el servicio de Postgres de Railway vuelve a levantar desde el panel, conviene
sacar un dump fresco antes de dar por buena la migración, porque tendría los datos
posteriores al 18-02-2026:

```bash
export PATH="/c/Program Files/PostgreSQL/17/bin:$PATH"
pg_dump --format=custom --no-owner --no-privileges \
  --file=backend/backup-railway.dump \
  "$DATABASE_URL_DE_RAILWAY"
```
