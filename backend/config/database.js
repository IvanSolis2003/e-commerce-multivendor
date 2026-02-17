const path = require('path');

module.exports = ({ env }) => {
    // Limpieza agresiva de comillas literales que puedan venir del panel de Railway
    const dbUrl = (env('DATABASE_URL') || '').replace(/["']/g, '');
    const dbClient = (env('DATABASE_CLIENT') || 'postgres').replace(/["']/g, '');

    console.log('[STRAPI CONFIG] Detectando configuración de base de datos...');
    console.log(`[STRAPI CONFIG] Cliente: ${dbClient}`);
    console.log(`[STRAPI CONFIG] URL presente: ${!!dbUrl}`);

    // Si hay una URL de base de datos o el cliente es postgres, configuramos Postgres (Railway)
    if (dbUrl || dbClient === 'postgres') {
        return {
            connection: {
                client: 'postgres',
                connection: {
                    connectionString: dbUrl,
                    ssl: env.bool('DATABASE_SSL', true) ? { rejectUnauthorized: false } : false,
                },
                pool: {
                    min: env.int('DATABASE_POOL_MIN', 2),
                    max: env.int('DATABASE_POOL_MAX', 10),
                },
            },
        };
    }

    // Fallback a SQLite para desarrollo local si no hay variables de producción
    return {
        connection: {
            client: 'sqlite',
            connection: {
                filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
            },
            useNullAsDefault: true,
        },
    };
};
