import decode from 'jwt-decode'
import auth0 from 'auth0-js'
import Router from 'vue-router'
import axios from 'axios'
import { CLIENT_ID, CLIENT_DOMAIN, REDIRECT, AUDIENCE } from '../clientConfig'
const ID_TOKEN_KEY = 'id_token'
const ACCESS_TOKEN_KEY = 'access_token'
const SCOPE = 'openid profile'

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
  resetAxiosConfig()
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

// resets the default axios config to no longer include local jwt in request headers
export function resetAxiosConfig() {
  delete axios.defaults.headers.common['x-access-token'];
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
