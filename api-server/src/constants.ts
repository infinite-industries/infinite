/**
 * This file is used for importing, defaulting and re-exporting as constants values from the environment.
 *
 * When defaulting values provide defaults suitable for local development. This makes onboarding simple. For
 * production and staging deployments most of these values will need to be explicitly set.
 *
 */
import * as fs from "fs";
import * as path from "path";
import {NullableOrUndefinable} from "./utils/NullableOrUndefinable";
import {isNullOrUndefined} from "./utils";

console.log('!!! MUCH HERE: ' + __dirname + "/db_constants.js")
// db related values have to be defined in commonjs, we re-expose them here for convenience in typescript
export const {
    SEQUELIZE_LOGGING,
    DEBUG_MIGRATION,
    DB_USER_NAME,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
    DB_HOST,
    SQL_IS_USING_SSL,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PW,
// eslint-disable-next-line @typescript-eslint/no-var-requires
} = require(__dirname + "/db_constants.js")

require('dotenv').config();

// === Top Level Service (name, ports env, etc..) ===
const DEFAULT_PORT = 3003;
export const PORT = isNullOrUndefined(process.env.PORT) ? DEFAULT_PORT : process.env.PORT;
export const INFINITE_WEB_PORTAL_BASE_URL = process.env.APP_URL || 'http://localhost:7779/';
export const ENV = process.env.ENV || 'dev';

// === Auth0 Login ====
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH0_CLIENT_DOMAIN  = process.env.AUTH0_CLIENT_DOMAIN;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH0_LOGIN_URL = `https://${AUTH0_CLIENT_DOMAIN}/oauth/token`;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

// === Test User Login ===
export const AUTH_USE_TEST_USERS = isNullOrUndefined(process.env.AUTH_USE_TEST_USERS) ?
    true :
    isTrueFromString(process.env.AUTH_USE_TEST_USERS);;
export const AUTH_USE_TEST_USERS_WARNING = 'LOCAL TEST USERS IS ENABLED. IF THIS IS PRODUCTION THERE IS A PROBLEM';

// === Authentication (Affects Auth0 or Test User)
export const PATH_TO_PEM = process.env.JWT_PEM || getPemPathDefault(AUTH_USE_TEST_USERS);;
export const SECRET = fs.readFileSync(path.resolve(PATH_TO_PEM));

// === Bitly Link Shortening
export const BITLY_URI ='https://api-ssl.bitly.com/v4/shorten';
export const BITLY_TOKEN = process.env.BITLY_TOKEN;


// === Slack Notifications ===
export const SLACK_WEBHOOK_TEST = process.env.SLACK_WEBHOOK_TEST;
export const SLACK_WEBHOOK_CONTACT = process.env.SLACK_WEBHOOK_CONTACT;
export const SLACK_WEBHOOK_EVENT_SUBMISSION = process.env.SLACK_WEBHOOK_EVENT_SUBMISSION;
export const SLACK_WEBHOOK_VENUE_SUBMISSION = process.env.SLACK_WEBHOOK_VENUE_SUBMISSION;

// === Helper Functions ===
function getPemPathDefault(authTestUsers) {
    return authTestUsers ?
        './test-keys/1nfinite_testing_rsa256.rsa' :
        './keys/1nfinite.pem';
}

function isTrueFromString(value: NullableOrUndefinable<string>): boolean {
    return (value || '').toLowerCase() === 'true';
}

