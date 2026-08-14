# Despliegue del backend en EC2

Strapi en Docker detrás de Caddy, que resuelve el certificado TLS de forma
automática. La base de datos vive en Neon (ver [migracion-bd-neon.md](migracion-bd-neon.md))
y las imágenes en Cloudinary, así que la instancia no guarda estado: puede
recrearse entera sin pérdida de datos.

Instancia de referencia: Ubuntu 22.04/24.04, t3.medium (4 GB). Con esa memoria
el build de Strapi corre directo en la instancia y no hace falta swap.

## 1. Preparación en AWS

**IP elástica.** Asóciale una a la instancia. Sin ella la IP pública cambia cada
vez que se detiene y arranca, y el registro DNS queda apuntando al vacío.

**Grupo de seguridad**, reglas de entrada:

| Puerto | Origen | Motivo |
|---|---|---|
| 22 | Solo tu IP | SSH. No lo dejes abierto a `0.0.0.0/0`. |
| 80 | `0.0.0.0/0` | Let's Encrypt valida el dominio por aquí. Obligatorio. |
| 443 | `0.0.0.0/0` | El tráfico real. |

El 1337 **no se abre**: Strapi solo escucha en la red interna de Docker y se
llega a él a través de Caddy.

**DNS.** Crea un registro `A` para el subdominio (por ejemplo
`api.tudominio.com`) apuntando a la IP elástica. Hazlo **antes** de levantar
Caddy: si el dominio no resuelve todavía, Let's Encrypt falla la validación y
aplica límites de reintento.

Comprueba la propagación antes de seguir:

```bash
dig +short api.tudominio.com
```

## 2. Docker en la instancia

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
| sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Evita tener que usar sudo en cada comando de docker
sudo usermod -aG docker $USER
newgrp docker
```

## 3. Código y configuración

```bash
git clone https://github.com/IvanSolis2003/e-commerce-multivendor.git
cd e-commerce-multivendor/deploy

cp .env.example .env
nano .env
```

Rellena `deploy/.env`:

- `DOMINIO` y `PUBLIC_URL` con tu subdominio.
- `DATABASE_URL` con el endpoint **pooled** de Neon (el host con sufijo
  `-pooler`). El directo es solo para dump y restore.
- Los seis secretos de Strapi **copiados tal cual** desde el `.env` actual. Si se
  regeneran, se invalidan las sesiones y los datos cifrados del respaldo ya
  restaurado.
- Las tres credenciales de Cloudinary.
- `CORS_ORIGINS` con la URL del frontend en Vercel.

## 4. Levantar

```bash
docker compose up -d --build
```

El primer build tarda varios minutos: compila el panel de admin. Seguimiento:

```bash
docker compose logs -f
```

Caddy pide el certificado en cuanto arranca. En sus logs debe aparecer
`certificate obtained successfully`.

## 5. Verificación

```bash
# Debe responder 204
curl -I https://api.tudominio.com/_health

# Debe devolver JSON con los 8 productos
curl -s "https://api.tudominio.com/api/products?pagination[pageSize]=100" | head -c 400
```

Entra luego a `https://api.tudominio.com/admin` con `ivan.solis20.m@gmail.com` y
tu contraseña de siempre: el hash viene en el respaldo restaurado.

## 6. Conectar el frontend

En Vercel, cambia `NEXT_PUBLIC_API_URL` a `https://api.tudominio.com` y
**redespliega**: es una variable de build, no basta con guardarla.

Verifica después en el navegador que no haya errores de CORS ni de contenido
mixto en la consola.

## 7. Operación

```bash
docker compose logs -f strapi     # ver logs
docker compose restart strapi     # reiniciar
docker compose down               # detener todo

# Actualizar tras un cambio en el repositorio
git pull
docker compose up -d --build
```

Los contenedores llevan `restart: unless-stopped`, así que vuelven solos si la
instancia se reinicia.

## Problemas frecuentes

**El certificado no se emite.** Casi siempre es el puerto 80 cerrado en el grupo
de seguridad, o el DNS todavía sin propagar. Ambos son requisito de la
validación.

**El admin redirige a `http://` o falla el login.** Es la señal de que Strapi no
está confiando en las cabeceras del proxy. `IS_PROXIED=true` ya va fijado en el
compose y `config/server.ts` lo lee; comprueba que la variable llegue al
contenedor con `docker compose exec strapi env | grep IS_PROXIED`.

**El frontend recibe errores de CORS.** Revisa que `CORS_ORIGINS` contenga la URL
exacta del frontend, con esquema y sin barra final.

**El build se queda sin memoria.** No debería con 4 GB, pero si ocurre al migrar
a una instancia menor, añade swap:

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Qué queda pendiente de automatizar

El despliegue es manual: `git pull` y `docker compose up -d --build` en la
instancia. Si más adelante conviene, el paso natural es un workflow de GitHub
Actions que construya la imagen y la publique, con la instancia limitándose a
descargarla.
