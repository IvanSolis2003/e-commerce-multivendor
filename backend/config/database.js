module.exports = ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            connectionString: env('DATABASE_URL'),
            ssl: {
                rejectUnauthorized: false,
            },
        },
        // min en 0 para que Neon pueda auto-suspender el computo cuando no hay
        // trafico. Con min > 0 el pool mantiene conexiones abiertas de forma
        // permanente, la base nunca se duerme y se consumen horas de computo
        // las 24 h aunque nadie use el sitio.
        pool: {
            min: 0,
            max: 10,
        },
    },
});
