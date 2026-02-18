module.exports = ({ env }) => {
    console.log('--- STRAPI DATABASE LOADER ---');

    // Limpieza de comillas que Railway pudiera estar pasando
    const rawUrl = env('DATABASE_URL', '');
    const url = String(rawUrl).replace(/["']/g, '').trim();

    console.log('DATABASE_URL detected:', url ? 'YES (cleaned)' : 'NO');

    return {
        connection: {
            client: 'postgres',
            connection: {
                connectionString: url,
                ssl: {
                    rejectUnauthorized: false,
                },
            },
            pool: {
                min: 2,
                max: 10,
            },
        },
    };
};
