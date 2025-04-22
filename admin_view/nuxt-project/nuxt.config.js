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
    middleware: ["auth"],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/main.scss"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "~/plugins/axios.js", ssr: false },
    { src: "~/plugins/fileter.js", ssr: false },
    { src: "~/plugins/firebase.js" },
    { src: "~/plugins/role" },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',                 // v3/v4 を利用
    ['@nuxtjs/moment', ['ja']]
  ],

  axios: {
    // baseURL: 'http://localhost:3000'
    baseURL: process.env.VUE_APP_API_URL,
    browserBaseURL: process.env.VUE_APP_URL,
  },

  auth: {
    redirect: {
      login: '/',
      logout: '/',
      home: '/dashboard',
      callback: false,
    },
    strategies: {
      local: {
        token: {
          property: 'token',
          type: 'Bearer',
          name: 'Authorization',
          global: true,
        },
        user: {
          property: false,
          autoFetch: false,
        },
        endpoints: {
          login:  { url: '/users/sign_in',  method: 'post' },
          logout: { url: '/users/sign_out', method: 'delete' },
          user:   { url: '/users/me',         method: 'get' },
        },
      },
    },
  },
};
