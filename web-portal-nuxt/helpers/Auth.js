import decode from 'jwt-decode'
import axios from 'axios'
const ID_TOKEN_KEY = 'auth._token.auth0'
const ACCESS_TOKEN_KEY = 'access_token'

export function getIdToken() {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const token = localStorage.getItem(ID_TOKEN_KEY)

  if (!token || token === 'false') {
    return null
  } else {
    return token
  }
}

// returns a config object for axios posts with token set
export function getConfigForReq() {
  const token = getIdToken()
  if (!token) { return {} }

  return { headers: { 'x-access-token': getIdToken() } }
}

export function setAxiosConfig() {
  const idToken = getIdToken()
  if (idToken) {
    const idTokenStripped = idToken.replace('Bearer ', '')
    axios.defaults.headers.common['x-access-token'] = idTokenStripped
  }
}
// resets the default axios config to no longer include local jwt in request headers
export function resetAxiosConfig() {
  delete axios.defaults.headers.common['x-access-token']
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function isAdmin() {
  const idToken = getIdToken()
  if (!idToken) { return false }

  try {
    const token = decode(idToken)
    return !!token['https://infinite.industries.com/isInfiniteAdmin']
  } catch (error) {
    console.warn(error)
  }

  return false
}

export function getUsername() {
  const idToken = getIdToken()
  if (!idToken) { return false }

  try {
    const token = decode(idToken)
    return token.nickname
  } catch (error) {
    console.warn(error)
  }

  return false
}
