// Require .env files for environment variables (keys and secrets)
require('dotenv').config();

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootroot',
      database: process.env.DB_NAME || 'lost-found',
      charset: 'utf8',
      timezone: process.env.DB_TIMEZONE || '-04:00',
    },
  },
};
