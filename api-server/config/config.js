require('dotenv').config();

const isUsingSSL = (process.env.SQL_IS_USING_SSL || '').toLowerCase() === 'true';

const dialectOptions = isUsingSSL
    ?
    {
      ssl: {
        require: true
      }
    }
    : undefined;


const options = {
  //logging: console.log, # Uncomment this to output
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  ssl: isUsingSSL,
  dialectOptions
}

module.exports = {
  development: options,
  test: options,
  production: options
}
