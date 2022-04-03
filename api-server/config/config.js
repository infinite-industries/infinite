/* eslint-disable @typescript-eslint/no-var-requires */
const {
  DB_USER_NAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  SQL_IS_USING_SSL,
  SEQUELIZE_LOGGING
} = require(__dirname + "/../src/db_constants.js");

const dialectOptions = SQL_IS_USING_SSL ?
    {
      ssl: {
        require: true
      }
    }
    : undefined;


const options = {
  logging: SEQUELIZE_LOGGING ? console.log : undefined,
  username: DB_USER_NAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  ssl: SQL_IS_USING_SSL,
  dialectOptions
};

module.exports = {
  development: options,
  test: options,
  production: options
};
