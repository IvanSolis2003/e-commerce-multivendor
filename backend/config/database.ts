import path from 'path';

export default ({ env }) => {
  const client = 'postgres';

  const url = env('DATABASE_URL');

  console.log('DATABASE_URL:', url);

  return {
    connection: {
      client,
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
