// Update with your config settings.
// load connection settings
require('dotenv').config();

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host:     process.env.PG_HOST,
      port:     process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      user:     process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  test: {
    client: 'postgresql',
    connection: {
      host:     process.env.PGHOST,
      port:     process.env.PGPORT,
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};
