import colors from 'vuetify/util/colors'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // head
  app: {
    head: {
      // TODO: how much of this should be pulled from env / another config?
      //       important consideration for reusability
      //       if we put some of this in .env, anything non-sensitive could be
      //       supplied in .env.sample
      titleTemplate: '%s - Infinite Industries',
      title: 'Infinite Industries',
      meta: [
        // charset: utf-8 set by default
        // viewport: width=device.width, initial-scale=1 charset: utf-8 set by default
        { name: 'title', content: 'Infinite Industries' },
        { name: 'description', content: 'Infinite Industries is an experimental digital platform that makes high quality contemporary culture accessible to everyone.' },
        { name: 'referrer', content: 'unsafe-url' },

        { property: 'author', content: 'infinte industries' },

        { property: 'og:title', content: 'Infinite Industries' },
        { property: 'og:site_name', content: 'Infinite Industries' },
        { property: 'og:url', content: process.env.APP_URL },
        { property: 'og:type', content: 'article' },
        { property: 'og:description', content: 'Infinite Industries is an experimental digital platform that makes high quality contemporary culture accessible to everyone.' },
        { property: 'og:image', content: process.env.APP_URL + '/images/default.jpg' },
        { property: 'og:image:alt', content: 'Infinite Industries' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@1nfinite_1' },
        { name: 'twitter:creator', content: '@1nfinite_1' },
        { name: 'twitter:title', content: 'Infinite Industries' },
        { name: 'twitter:description', content: 'Infinite Industries is an experimental digital platform that makes high quality contemporary culture accessible to everyone.' },
        { name: 'twitter:image:src', content: process.env.APP_URL + '/images/default.jpg' },

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
        // { // TODO: Nuxt docs suggest this, worth trying
        //   rel: 'preconnect',
        //   href: 'https://fonts.googleapis.com'
        // },
        {
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
    }
  },

  /*
  ** Customize the progress-bar color
  */
  // loading (if this is still valid)

  /*
  ** Global CSS
  */
  // css: [
  // ]
  /*
  ** Plugins to load before mounting the App
  */
  // plugins: [
  // ],
  /*

  ** Nuxt.js modules
  */
  modules: [
    'nuxt-auth-utils',
    'nuxt3-vuex-module',
    'vuetify-nuxt-module',
    // 'vue-scrollto/nuxt' // broken?
  ],

  /*
  ** Auth configuration
  */
  // auth: {
  // },
  /*
  ** vuetify module configuration
  ** https://nuxt.vuetifyjs.com/guide/#module-options
  */
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: colors.blue.darken2,
              accent: colors.grey.darken3,
              secondary: colors.amber.darken3,
              info: colors.teal.lighten1,
              warning: colors.amber.base,
              error: colors.deepOrange.accent4,
              success: colors.green.accent3,
            }
          }
        }
      },
      // overriding default props for easier backwards-compatibility for
      // existing appearance
      defaults: {
        VCombobox: {
          variant: 'underlined'
        },
        VRow: {
          noGutters: true,
        },
        VTextField: {
          variant: 'underlined'
        },
        VTextarea: {
          variant: 'underlined'
        }
      },
    },
  },
  /*
  ** (Dev) Server configuration
  */
  devServer: {
    port: 7779
  },

  // this may not be needed
  /*
  ** Server middleware
  */
  // serverMiddleware: [
  // ],
  /*
  ** Build configuration
  */
  // build: {
  // }

  runtimeConfig: {
    slackWebhookContact: '',
    slackWebhookAnalytics: '',
    public: {
      appUrl: 'http://localhost:7779',
      apiUrl: 'http://localhost:3003/v1',
      fathomSiteId: '',
      timezoneDefault: 'US/Eastern',
      timezoneOptions: 'US/Eastern,US/Central'
    },
  }
})