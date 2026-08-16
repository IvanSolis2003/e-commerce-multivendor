#!/usr/bin/env bash
# Despliega en la instancia la ultima imagen publicada por GitHub Actions.
#
#   cd ~/e-commerce-multivendor/deploy && ./actualizar.sh
#
# Requiere haberse autenticado antes en GHCR una sola vez:
#   echo "$TOKEN" | docker login ghcr.io -u IvanSolis2003 --password-stdin

set -uo pipefail
cd "$(dirname "$0")" || exit 1

COMPOSE="docker compose"
command -v docker > /dev/null || { echo "docker no esta instalado"; exit 1; }
docker info > /dev/null 2>&1 || COMPOSE="sudo docker compose"

echo "=== 1. Actualizando los archivos de infraestructura ==="
git -C .. pull --ff-only origin main || echo "aviso: no se pudo actualizar el repo, se sigue con lo que hay"

echo ""
echo "=== 2. Descargando la imagen ==="
if ! $COMPOSE pull strapi; then
  echo "ERROR: no se pudo descargar la imagen."
  echo "Si es un problema de permisos, vuelve a autenticarte en GHCR:"
  echo '  echo "$TOKEN" | docker login ghcr.io -u IvanSolis2003 --password-stdin'
  exit 1
fi

echo ""
echo "=== 3. Reiniciando el servicio ==="
$COMPOSE up -d

echo ""
echo "=== 4. Esperando a que responda ==="
for i in $(seq 1 24); do
  if $COMPOSE exec -T strapi node -e 'fetch("http://localhost:1337/_health").then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))' 2>/dev/null; then
    echo "operativo tras ~$((i * 10))s"
    $COMPOSE ps --format "{{.Name}}  {{.Status}}"
    echo ""
    echo "imagen en ejecucion:"
    docker inspect --format '{{.Config.Image}}' "$($COMPOSE ps -q strapi)" 2>/dev/null \
      || sudo docker inspect --format '{{.Config.Image}}' "$($COMPOSE ps -q strapi)"
    exit 0
  fi
  sleep 10
done

echo "ERROR: el servicio no respondio en 4 minutos. Revisa los logs:"
echo "  $COMPOSE logs --tail 50 strapi"
exit 1
