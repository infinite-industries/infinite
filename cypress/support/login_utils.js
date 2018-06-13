import { CLIENT_ID, CLIENT_DOMAIN } from '../../src/clientConfig';

/**
 * constructs an JWT ID token for a given user's information
 * @param user a object that should contain at least a name /
 * email and whether the user is an admin
 * @returns a JWT token for the user
 */
export function getIDTokenForUser(user) {
  return encodeToken(Object.assign({}, user, {
    aud: CLIENT_ID,
    iss: "https://" + CLIENT_DOMAIN + "/",
    updated_at: (new Date()).toISOString(),
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 36000
  }))
}

/**
 * constructs a JWT access token for a given user's information
 */
export function getAccessToken(user) {
  return encodeToken({
    iss: "https://" + CLIENT_DOMAIN + "/",
    sub: user.sub,
    aud: [
      "https://" + CLIENT_DOMAIN + "/api/v2/",
      "https://" + CLIENT_DOMAIN + "/userinfo"
    ],
    iat: parseInt(Date.now() / 1000),
    exp: parseInt(Date.now() / 1000) + 7200,
    azp: CLIENT_ID,
    scope: "openid profile"
  });
}

function encodeToken(body) {
  return [
    Buffer.from('{"typ":"JWT"}', 'ascii').toString('base64'),
    Buffer.from(JSON.stringify(body), 'ascii').toString('base64')
  ].join('.');
}
