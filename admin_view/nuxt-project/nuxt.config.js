export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  server: {
    host: "0.0.0.0",
    port: 8000,
  },
  watchQuery: ["page"],
  head: {
    titleTemplate: "参加団体管理アプリ-管理者ページ",
    title: "管理者ページ",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/icon?family=Material+Icons",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Noto+Sans+JP",
      },
    ],
  },

  publicRuntimeConfig: {
    apiURL: process.env.VUE_APP_URL
  },

  router: {
    middleware: ["auth", "check-auth"],
  },

  css: ["~/assets/main.scss"],

  plugins: [
    { src: "~/plugins/axios.js", ssr: false },
    { src: "~/plugins/fileter.js", ssr: false },
    { src: "~/plugins/firebase.js" },
    { src: "~/plugins/role" },
  ],

  components: true,

  buildModules: [
    "@nuxtjs/vuetify",
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',                 // v3/v4 を利用
    ['@nuxtjs/moment', ['ja']]
  ],

  axios: {
    // proxy: true,
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
    browserBaseURL: process.env.VUE_APP_URL || 'http://localhost:8000',
    credentials: true
  },

  // proxy: {
  //   '/api/': {
  //     target: process.env.VUE_APP_API_URL || 'http://localhost:3000'
  //   },
  //   '/users/': {
  //     target: process.env.VUE_APP_API_URL || 'http://localhost:3000'
  //   },
  //   '/current_user': {
  //     target: process.env.VUE_APP_API_URL || 'http://localhost:3000'
  //   },
  //   '/memos': {
  //     target: process.env.VUE_APP_API_URL || 'http://localhost:3000'
  //   }
  // },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: '/dashboard',
      callback: false,
    },
    strategies: {
      local: {
        scheme: 'cookie',
        cookie: {
          name: 'jwt'
        },
        token: false,
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/users/sign_in', method: 'post' },
          logout: { url: '/users/sign_out', method: 'delete' },
          user: { url: '/current_user', method: 'get' }
        }
      }
    },
    localStorage: false,
    cookie: {
      prefix: '',
      options: {
        path: '/'
      }
    }
  },
};
