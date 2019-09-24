import colors from 'vuetify/es5/util/colors'
import 'dotenv/config'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    // TODO: how much of this should be pulled from env / another config?
    //       important consideration for reusability
    //       if we put some of this in .env, anything non-sensitive could be
    //       supplied in .env.sample
    titleTemplate: '%s - Infinite Industries',
    title: 'Infinite Industries',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      { hid: 'title', name: 'title', content: 'Infinite Industries' },
      { hid: 'description', name: 'description', content: 'Infinite Industries is an experimental digital platform that makes high quality contemporary culture accessible to everyone.' },
      { name: 'referrer', content: 'unsafe-url' },

      { property: 'author', content: 'infinte industries' },

      { hid: 'fb:app_id', property: 'fb:app_id', content: process.env.FACEBOOK_APP_ID },
      { hid: 'og:title', property: 'og:title', content: 'Infinite Industries' },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Infinite Industries' },
      { hid: 'og:url', property: 'og:url', content: process.env.APP_URL },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:description', property: 'og:description', content: 'Infinite Industries is an experimental digital platform that makes high quality contemporary culture accessible to everyone.' },
      { hid: 'og:image', property: 'og:image', content: process.env.APP_URL + '/images/default.jpg' },
      { hid: 'og:image:alt', property: 'og:image:alt', content: 'Infinite Industries' },

      { hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@1nfinite_1' },
      { hid: 'twitter:creator', name: 'twitter:creator', content: '@1nfinite_1' },
      { hid: 'twitter:title', name: 'twitter:title', content: 'Infinite Industries' },
      { hid: 'twitter:description', name: 'twitter:description', content: 'Infinite Industries is an experimental digital platform that makes high quality contemporary culture accessible to everyone.' },
      { hid: 'twitter:image:src', name: 'twitter:image:src', content: process.env.APP_URL + '/images/default.jpg' },

      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'application-name', content: 'Infinite' },
      { name: 'apple-mobile-web-app-title', content: 'Infinite' },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'msapplication-navbutton-color', content: '#ffffff' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'msapplication-starturl', content: '/' }
    ],
    link: [
      { hid: 'canonical', rel: 'canonical', href: process.env.APP_URL + '/' },
      { rel: 'me', href: 'https://twitter.com/1nfinite_1' },

      { rel: 'manifest', href: '/manifest.json' },

      { rel: 'icon', type: 'image/png', sizes: '192X192', href: '/images/favicon_192.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '192X192', href: '/images/favicon_192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512X512', href: '/images/favicon_512.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '512X512', href: '/images/favicon_512.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
      // TODO: this may or not be necessary, depending on whether we keep this in the App SFC stylesheet
      // {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=EB+Garamond|Open+Sans:400,600,600i,700'
      // }
    ],
    script: [
      { src: '/workers/workers.js?v="1.0.02"' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vue-moment',
    '~/plugins/vue-smoothscroll',
    { src: '~/plugins/vue-editor', ssr: false }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/google-gtag',
    '@nuxtjs/eslint-module',
    'nuxt-clipboard2'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Auth configuration
  */
  auth: {
    strategies: {
      local: false,
      auth0: {
        scope: ['openid', 'profile'],
        response_type: 'token id_token',
        token_key: 'id_token',
        userinfo_endpoint: false,
        audience: process.env.AUTH0_AUDIENCE,
        domain: process.env.AUTH0_CLIENT_DOMAIN,
        client_id: process.env.AUTH0_CLIENT_ID,
        redirect_uri: process.env.AUTH0_CALLBACK
      }
    }
  },
  /*
  ** Google Analytics configuration
  */
  'google-gtag': {
    id: process.env.GOOGLE_ANALYTICS_ID,
    config: {
      anonymize_ip: true // TODO: can we do this?
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    theme: {
      primary: colors.blue.darken2,
      accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    }
  },
  /*
  ** Server configuration
  */
  server: {
    port: 7779
  },
  /*
  ** Server middleware
  */
  serverMiddleware: [
    { path: '/internal-api/images', handler: '~/internal-api/upload-images.js' }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_DOMAIN: process.env.CLIENT_DOMAIN,
    REDIRECT: process.env.REDIRECT,
    AUDIENCE: process.env.AUDIENCE,
    APP_URL: process.env.APP_URL,
    API_URL: process.env.API_URL
  }
}
