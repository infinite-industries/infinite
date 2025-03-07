import { defineNuxtConfig } from '@nuxt/bridge'
// import colors from 'vuetify/es5/util/colors'
import { json } from 'body-parser'

const API_URL = process.env.API_URL || 'http://localhost:3003/v1'
const APP_URL = process.env.APP_URL || 'http://localhost:7779'
const TIMEZONE_DEFAULT = process.env.TIMEZONE_DEFAULT || 'US/Eastern'
const TIMEZONE_OPTIONS = process.env.TIMEZONE_OPTIONS || 'US/Eastern,US/Central'
const FATHOM_SITE_ID = process.env.FATHOM_SITE_ID

export default defineNuxtConfig({
  bridge: {
    // enabling this breaks everything immediately
    nitro: true,
    // should enable this at some point if we make progress on Nitro,
    // docs imply it's not necessary in combination w/ Nitro
    // vite: true,
    // disabling auto-imports to narrow down what might be causing the error
    autoImports: false,
    imports: false
  },
  // mode: 'universal',
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
      { rel: 'me', href: 'https://twitter.com/1nfinite_1' },

      { rel: 'manifest', href: '/manifest.json' },

      { rel: 'icon', type: 'image/png', sizes: '192X192', href: '/images/favicon_192.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '192X192', href: '/images/favicon_192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512X512', href: '/images/favicon_512.png' },
      { rel: 'apple-touch-icon', type: 'image/png', sizes: '512X512', href: '/images/favicon_512.png' },
      // TODO: for some reason our fonts don't work when the nuxt app is built;
      // fix that and then remove this stylesheet
      {
        hid: 'fonts',
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=EB+Garamond|Open+Sans:400,400i,600,600i,700'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/icon?family=Material+Icons'
      }
    ],
    script: [
      {
        src: '/workers/workers.js?v=\'1.0.01\''
      }
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
  // plugins: [
  //   '~/plugins/vue-moment',
  //   { src: '~/plugins/vue-editor', ssr: false },
  //   '~/plugins/close-sidebar-on-nav.client.js', // client-only
  //   '~/plugins/api-service-plugin.js',
  //   '~/plugins/suggestion-service-plugin.js',
  //   '~/plugins/page-meta-plugin.js',
  //   '~/plugins/analytics.client.js',
  //   // '~/plugins/migrationtest.js'
  // ],
  /*
  ** Nuxt.js modules
  */
  // modules: [
  //   '@nuxtjs/vuetify',
  //   // Doc: https://axios.nuxtjs.org/usage
  //   '@nuxtjs/axios',
  //   '@nuxtjs/auth',
  //   ['@nuxtjs/pwa', { workbox: false, icon: false }],
  //   '@nuxtjs/google-gtag',
  //   '@nuxtjs/eslint-module',
  //   'nuxt-clipboard2',
  //   'vue-scrollto/nuxt'
  // ],


  /*
  ** Auth configuration
  */
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          // required: true,
          type: 'Bearer'
        },
        endpoints: {
          login: { url: API_URL + '/authentication/login', method: 'post', propertyName: 'token' },
          user: false,
          logout: false
        }
      }
    }
  },
  /*
  ** Google Analytics configuration
  */
  // 'google-gtag': {
  //   id: process.env.GOOGLE_ANALYTICS_ID,
  //   config: {
  //     anonymize_ip: true // TODO: can we do this?
  //   }
  // },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  // vuetify: {
  //   // theme: {
  //   //   primary: colors.blue.darken2,
  //   //   accent: colors.grey.darken3,
  //   //   secondary: colors.amber.darken3,
  //   //   info: colors.teal.lighten1,
  //   //   warning: colors.amber.base,
  //   //   error: colors.deepOrange.accent4,
  //   //   success: colors.green.accent3
  //   // }
  // },
  /*
  ** Server configuration
  */
  server: {
    port: 7779,
    host: process.env.HOST || 'localhost'
  },
  /*
  ** Server middleware
  */
  serverMiddleware: [
    json(),
    { path: '/internal-api/slack-alert', handler: '~/internal-api/slack-alert.js' },
    { path: '/internal-api/analytics', handler: '~/internal-api/slack-analytics' }
  ],
  /*
  ** Build configuration
  */
  build: {
    transpile: /@fullcalendar.*/,
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },

  // enabling Nitro is a prereq for updating to this new runtime config setup
  // places where we reference these will need to be changed to $config.public.APP_URL etc
  runtimeConfig: {
    public: {
      APP_URL,
      API_URL,
      FATHOM_SITE_ID,
      TIMEZONE_DEFAULT,
      TIMEZONE_OPTIONS
    }
  }
})
