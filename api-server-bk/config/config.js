require('dotenv').config();

module.exports = {
  "development": {
    //logging: console.log, # Uncomment this to output
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PW,
    "database": process.env.POSTGRES_DB,
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PW,
    "database": process.env.POSTGRES_DB,
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PW,
    "database": process.env.POSTGRES_DB,
    "host": process.env.POSTGRES_HOST,
    "port": process.env.POSTGRES_PORT,
    "dialect": "postgres"
  }
}
