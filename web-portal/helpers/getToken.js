const TOKEN_KEY = '_token.local'

export default function getToken($auth) {
  // according to docs this should be much simpler but this is the only way I seem to be able to get the token
  // (https://github.com/nuxt-community/auth-module/issues/844)

  return $auth.$storage.getState(TOKEN_KEY)
}
