# Migración de la base de datos a Neon

Procedimiento para levantar la base del proyecto en Neon (PostgreSQL serverless),
saliendo de Railway.

## Situación de partida

| Origen | Estado |
|---|---|
| Postgres de Railway (`railway` @ `gondola.proxy.rlwy.net:25113`) | **Caído.** El proxy acepta TCP pero el servidor cierra la conexión de inmediato en cualquier `sslmode`. No se puede sacar un dump. |
| `backend/backup.dump` | **Válido.** Formato CUSTOM, gzip, generado con pg_dump 17.7 desde la base local `ecommerce_db` el 18-02-2026. |
| Postgres local (`localhost:5432`) | Corriendo, pero la contraseña del `.env` es la de Railway, no la local. |

> Ojo: `backup.dump` es de `ecommerce_db` (local), **no** de `railway`. Cualquier
> dato generado en producción después del 18-02-2026 solo existe en Railway y hoy
> es inaccesible.

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
- Neon corre PostgreSQL 17 y el dump se generó con 17.7: sin problemas de versión.

## Restauración

Las herramientas de cliente están en `C:\Program Files\PostgreSQL\17\bin`, fuera
del PATH. En Git Bash:

```bash
export PATH="/c/Program Files/PostgreSQL/17/bin:$PATH"
```

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

## Cambios en la aplicación

1. **`DATABASE_URL`** en el nuevo host del backend → cadena de Neon.
   `backend/config/database.js` ya lee solo `DATABASE_URL` y usa
   `ssl.rejectUnauthorized: false`, compatible con Neon sin tocar código.

2. **Pool de conexiones.** Hoy `database.js` declara `pool: { min: 2, max: 10 }`.
   Con Neon eso mantiene dos conexiones abiertas de forma permanente, lo que impide
   el auto-suspend y consume horas de cómputo del plan gratuito de forma continua.
   Para Neon conviene `min: 0`, y usar el endpoint *pooled* (el que lleva `-pooler`
   en el host).

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
