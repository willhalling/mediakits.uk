import api from './store/api.js'

const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Free Media Kits for Creatives',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      {
        rel: 'preconnect',
        href: '//firestore.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: '//onesignal.com'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'anonymous',
        href: '/fonts/Roboto-Light.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'anonymous',
        href: '/fonts/Roboto-Regular.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'anonymous',
        href: '/fonts/Roboto-Bold.woff2'
      },
      {
        rel: 'preload',
        as: 'font',
        crossorigin: 'anonymous',
        href: '/fonts/VivaBeautiful.woff2'
      }
    ]
  },

  generate: {
    fallback: '404.html'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#0DFF92' },

  /*
  ** Global CSS
  */
  /*
  css: [
  ],
  */
  css: ['~/scss/app.scss'],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/components',
    '~plugins/scroll-to',
    '~plugins/firebase.js',
    '~plugins/vue-simple-svg',
    '~plugins/directives',
    { src: '~plugins/ga.js', mode: 'client' }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],

  // https://pwa.nuxtjs.org/modules/workbox
  workbox: {
    // Workbox options
  },

  /*
    ** Axios module configuration
    */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  /*
  ** Build configuration
  */
  build: {
    analyze: true,
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          //loader: 'eslint-loader', // @todo uncomment to turn eslint back on
          exclude: /(node_modules)/
        })
      }
    }
  },
  router: {
    middleware: 'pages'
  },
  server: {
    port: 5500, // default: 3000
    //host: '192.168.1.2' // default: localhost
  }
}
