import path from 'path';

export default ({ env }) => {
  const isPostgres = env('DATABASE_CLIENT') === 'postgres' || env('DATABASE_URL');

  return {
    connection: isPostgres
      ? {
        client: 'postgres',
        connection: {
          connectionString: env('DATABASE_URL'),
          ssl: env.bool('DATABASE_SSL', true)
            ? { rejectUnauthorized: false }
            : false,
        },
        pool: {
          min: env.int('DATABASE_POOL_MIN', 2),
          max: env.int('DATABASE_POOL_MAX', 10),
        },
      }
      : {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
        },
        useNullAsDefault: true,
      },
  };
};
