/*
  Values related to the database are imported, defaulted if not set and exported as constants

  This is done in plain js using common-js
 */

require('dotenv').config();

// === Database and Sequelize ===
module.exports.SEQUELIZE_LOGGING = !!process.env.SEQUELIZE_LOGGING;
module.exports.DEBUG_MIGRATION = isTrueFromString(process.env.DEBUG_MIGRATION);

// === Database Connection ===
module.exports.DB_USER_NAME = process.env.DB_USER_NAME || 'postgres';
module.exports.DB_PASSWORD = process.env.DB_PASSWORD || 'xxx';
module.exports.DB_NAME = process.env.DB_NAME || 'infinite-api';
module.exports.DB_PORT = !!process.env.DB_PORT ? +process.env.DB_PORT : 5436;
module.exports.DB_HOST= process.env.DB_HOST || 'localhost';
module.exports.SQL_IS_USING_SSL = isTrueFromString(process.env.SQL_IS_USING_SSL);

// === These values are used when starting postgres for running tests and are passed along to sequelize, they will typically be set by DOCKER env not .env ===
module.exports.POSTGRES_DB = process.env.POSTGRES_DB;
module.exports.POSTGRES_USER = process.env.POSTGRES_USER;
module.exports.POSTGRES_PW = process.env.POSTGRES_PW;

function isTrueFromString(value) {
  return (value || '').toLowerCase() === 'true';
}
