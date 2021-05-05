import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  server: {
    host: '0.0.0.0',
    port: 8000
  },
  head: {
    titleTemplate: '参加団体管理アプリ-管理者ページ',
    title: '管理者ページ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  router: {
    middleware: ['auth']
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/axios.js', ssr: false },
    { src: '~/plugins/fileter.js', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    ['@nuxtjs/moment', ['ja']],
  ],

  axios: {
    // baseURL: 'http://localhost:3000'
    baseURL: process.env.VUE_APP_URL
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      callback: false,
      home: '/dashboard'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/sign_in', method: 'post', propertyName: false },
          logout: false,
          user: false
        }
      }
    }
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: "#424242",
          accent: "#E040FB",
          secondary: "#37474F",
          info: "FFFFFF",
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: "#EEEEEE",
          text: "#333333",
          btn: "#E040FB"
        },
        light: {
          primary: "#333333",
          secondary: "#37474F",
          accent: "#b57614",
          info: "#333333",
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          background: "#EEEEEE",
          //for components
          header: "#424242",
          menu1: "#37474F",
          menu2: "#FFFFFF",
          btn: "#b16286",
          yes: "#cc241d",
          no: "#458588",
          loginbg: "#FFFFFF"
        }
      },
      options: { customProperties: true }
    },
  }
}
