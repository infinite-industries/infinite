/* eslint-disable @typescript-eslint/no-var-requires */

/* This is a ts wrapper around _constants.js. _constatnts.js is where all environment variable defaulting should happen
   The reason for this being done in js is that sequelize requires config.js to use common-modules
*/

export const {
    PORT,
    INFINITE_WEB_PORTAL_BASE_URL,
    ENV,
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
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_DOMAIN,
    AUTH0_AUDIENCE,
    AUTH0_LOGIN_URL,
    AUTH0_CLIENT_SECRET,
    AUTH_USE_TEST_USERS,
    AUTH_USE_TEST_USERS_WARNING,
    PATH_TO_PEM,
    SECRET,
    BITLY_URI,
    BITLY_TOKEN,
    SLACK_WEBHOOK_TEST,
    SLACK_WEBHOOK_CONTACT,
    SLACK_WEBHOOK_EVENT_SUBMISSION,
    SLACK_WEBHOOK_VENUE_SUBMISSION
} = require(__dirname + "/_constants.js")
