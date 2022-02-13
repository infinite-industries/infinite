/*
* This file is where we pull in all environment variables, exposing them as constan
*
* */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// === Top Level Service (name, ports env, etc..) ===
const DEFAULT_PORT = 3003;
module.exports.PORT = !!process.env.PORT ? DEFAULT_PORT : process.env.PORT;
module.exports.INFINITE_WEB_PORTAL_BASE_URL = process.env.APP_URL || 'http://localhost:7779/';
module.exports.ENV = process.env.ENV || 'dev';

// === Database and Sequelize ===
module.exports.SEQUELIZE_LOGGING = !!process.env.SEQUELIZE_LOGGING;
module.exports.DEBUG_MIGRATION = isTrueFromString(process.env.DEBUG_MIGRATION);


console.log('!!! MUCH PORT: ' + process.env.DB_PORT + ', ' + !!process.env.DB_PORT)
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

// === Auth0 Login ====
module.exports.AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
module.exports.AUTH0_CLIENT_DOMAIN  = process.env.AUTH0_CLIENT_DOMAIN;
module.exports.AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
module.exports.AUTH0_LOGIN_URL = `https://${module.exports.AUTH0_CLIENT_DOMAIN}/oauth/token`;
module.exports.AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

// === Test User Login ===
const AUTH_USE_TEST_USERS = isNullOrUndefined(process.env.AUTH_USE_TEST_USERS) ?
    true :
    isTrueFromString(process.env.AUTH_USE_TEST_USERS);

module.exports.AUTH_USE_TEST_USERS = AUTH_USE_TEST_USERS;
module.exports.AUTH_USE_TEST_USERS_WARNING = 'LOCAL TEST USERS IS ENABLED. IF THIS IS PRODUCTION THERE IS A PROBLEM';

// === Authentication (Affects Auth0 or Test User)
const PATH_TO_PEM = process.env.JWT_PEM || getPemPathDefault(AUTH_USE_TEST_USERS);
module.exports.PATH_TO_PEM = PATH_TO_PEM;
module.exports.SECRET = fs.readFileSync(path.resolve(PATH_TO_PEM));

// === Bitly Link Shortening
module.exports.BITLY_URI ='https://api-ssl.bitly.com/v4/shorten';
module.exports.BITLY_TOKEN = process.env.BITLY_TOKEN;


// === Slack Notifications ===
module.exports.SLACK_WEBHOOK_TEST = process.env.SLACK_WEBHOOK_TEST;
module.exports.SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT;
module.exports.SLACK_WEBHOOK_EVENT_SUBMISSION = process.env.SLACK_WEBHOOK_EVENT_SUBMISSION;
module.exports.SLACK_WEBHOOK_VENUE_SUBMISSION = process.env.SLACK_WEBHOOK_VENUE_SUBMISSION;

// === Helper Functions ===
function getPemPathDefault(authTestUsers) {
  return authTestUsers ?
      './test-keys/1nfinite_testing_rsa256.rsa' :
      './keys/1nfinite.pem';
}

function isTrueFromString(value) {
  return (value || '').toLowerCase() === 'true';
}

function isNullOrUndefined(value) {
  return value === undefined || value === null
}
