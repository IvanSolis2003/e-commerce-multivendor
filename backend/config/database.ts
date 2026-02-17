import path from 'path';

export default ({ env }) => {
  // Limpieza agresiva de comillas literales (Railway a veces las rodea con " ")
  const clientRaw = env('DATABASE_CLIENT', 'postgres');
  const client = String(clientRaw).replace(/["']/g, '').trim();

  const urlRaw = env('DATABASE_URL', '');
  const url = String(urlRaw).replace(/["']/g, '').trim();

  const sslRaw = env('DATABASE_SSL', 'true');
  const sslValue = String(sslRaw).replace(/["']/g, '').trim() === 'true';

  console.log('[POSTGRES_DEBUG] Iniciando configuración de base de datos...');
  console.log(`[POSTGRES_DEBUG] Cliente detectado: "${client}"`);
  console.log(`[POSTGRES_DEBUG] URL presente: ${!!url}`);
  console.log(`[POSTGRES_DEBUG] SSL habilitado: ${sslValue}`);

  const connections = {
    postgres: {
      client: 'postgres',
      connection: {
        connectionString: url,
        ssl: sslValue ? { rejectUnauthorized: false } : false,
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10)
      },
    },
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  // Forzamos que si el cliente es postgres, use postgres. Si no, intenta buscar en el mapa.
  const selectedConfig = (client === 'postgres' || url.includes('postgres'))
    ? connections.postgres
    : (connections[client] || connections.sqlite);

  return {
    connection: selectedConfig,
  };
};
