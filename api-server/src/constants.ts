import * as fs from "fs";
import * as path from "path";

export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
export const AUTH0_CLIENT_DOMAIN  = process.env.AUTH0_CLIENT_DOMAIN
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE
export const AUTH0_LOGIN_URL = `https://${AUTH0_CLIENT_DOMAIN}/oauth/token`
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET

export const AUTH_USE_TEST_USERS = (process.env.AUTH_USE_TEST_USERS || '').toLowerCase() === 'true'
export const AUTH_USE_TEST_USERS_WARNING = 'LOCAL TEST USERS IS ENABLED. IF THIS IS PRODUCTION THERE IS A PROBLEM'

export const PATH_TO_PEM = process.env.JWT_PEM || getPemPathDefault();
export const SECRET = fs.readFileSync(path.resolve(PATH_TO_PEM));

function getPemPathDefault() {
    return AUTH_USE_TEST_USERS
        ? './test-keys/1nfinite_testing_rsa256.rsa'
        : './keys/1nfinite.pem'
}
