import decode from 'jwt-decode'
import auth0 from 'auth0-js'
import Router from 'vue-router'

const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'
const SCOPE = 'openid profile'

// these doe not need to be kept secret but for testing would be nice to have a way to configure them during build
const CLIENT_ID = 'PYKhof4U0jKE3v4h8xKSgihHz9atBE5O'
const CLIENT_DOMAIN = '1nfinite.auth0.com1nfinite.auth0.com'
const REDIRECT = 'http://localhost:3004/callback'
const AUDIENCE = 'https://1nfinite.auth0.com/api/v2/'

const auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
})

const router = new Router({
  mode: 'history'
})

export function login () {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  })
}

export function logout () {
  clearIdToken()
  clearAccessToken()
  router.go('/')
}

export function requireAuth (to, from, next) {
  if (!isLoggedIn() || !isAdmin()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export function getIdToken () {
  return localStorage.getItem(ID_TOKEN_KEY) || undefined
}

// returns a config object for axios posts with token set
export function getConfigForReq () {
  const token = getIdToken()
  if (!token)
    return {}

  return { headers: {'x-access-token': getIdToken() } }
}

export function getAccessToken () {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken () {
  let accessToken = getParameterByName('access_token')
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export function setIdToken () {
  let idToken = getParameterByName('id_token')
  localStorage.setItem(ID_TOKEN_KEY, idToken)
}

export function isLoggedIn () {
  const idToken = getIdToken()
  let isLoggedIn = false

  try {
    isLoggedIn = !!idToken && !isTokenExpired(idToken)
  } catch (err) {
    console.warn('error: ' + err)
  }

  return isLoggedIn
}
export function isAdmin() {
  const idToken = getIdToken()
  if (!idToken)
    return false

  try {
    const token = decode(idToken)
    return !!token['https://infinite.industries.com/isInfiniteAdmin']
  } catch (error) {
    console.warn(error)
  }

  return false
}

// ==== Private Helpers ====
function clearIdToken () {
  localStorage.removeItem(ID_TOKEN_KEY)
}

function clearAccessToken () {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function getParameterByName (name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

// throws exception when token is invalid
function getTokenExpirationDate (encodedToken) {
  const token = decode(encodedToken)
  if (!token.exp) {
    return null
  }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

// throws exception if decode fails
function isTokenExpired (token) {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}
