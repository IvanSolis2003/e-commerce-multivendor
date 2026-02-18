import path from 'path';

export default ({ env }) => {
  const client = 'postgres';
  const url = env('DATABASE_URL');

  return {
    connection: {
      client,
      connection: url
        ? {
            connectionString: url,
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : {
            host: env('DATABASE_HOST'),
            port: env.int('DATABASE_PORT'),
            database: env('DATABASE_NAME'),
            user: env('DATABASE_USERNAME'),
            password: env('DATABASE_PASSWORD'),
            ssl: env.bool('DATABASE_SSL')
              ? {
                  rejectUnauthorized: false,
                }
              : false,
          },
      pool: {
        min: 2,
        max: 10,
      },
    },
  };
};
