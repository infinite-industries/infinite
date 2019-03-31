import { CLIENT_ID } from '../../src/clientConfig'
import { sign } from 'jsonwebtoken'

/**
 * constructs an JWT ID token for a given user's information
 * @param user an object containing information for the body of the token
 * @param cert secret used to sign the token
 * @returns a JWT for the user
 */
export function getIDTokenForUser(user, cert) {
  return sign(Object.assign({}, user, {
    aud: CLIENT_ID,
    iss: 'https://infinite.industries/'
  }), cert, { algorithm: 'RS256', expiresIn: 60 * 15 })
}

/**
 * constructs a JWT access token for a given user's information
 * @param user an object containing information for the body of the token
 * @param cert secret used to sign the token
 * @returns a JWT for the user
 */
export function getAccessTokenForUser(user, cert) {
  return sign({
    iss: 'https://infinite.industries/',
    sub: user.name,
    azp: CLIENT_ID,
    scope: 'openid profile'
  }, cert, { algorithm: 'RS256', expiresIn: 60 * 60 })
}
