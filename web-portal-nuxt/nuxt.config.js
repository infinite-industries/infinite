import colors from 'vuetify/es5/util/colors'
import 'dotenv/config'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', sizes: '192X192', href: '/images/favicon_192.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '192X192', href: '/images/4favicon_192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512X512', href: '/images/favicon_512.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '512X512', href: '/images/favicon_512.png' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
      // {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=EB+Garamond|Open+Sans:400,600,600i,700'
      // }
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
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/google-gtag', // TODO: need to install @nuxtjs/google-gtag
    '@nuxtjs/eslint-module'
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
  // auth: {
  //   strategies: {
  //     local: false,
  //     auth0: {
  //       domain: process.env.AUTH0_CLIENT_DOMAIN,
  //       client_id: process.env.AUTH0_CLIENT_ID,
  //       redirect_uri: process.env.AUTH0_CALLBACK
  //     }
  //   }
  // },
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
    API_URL: process.env.API_URL
  }
}
