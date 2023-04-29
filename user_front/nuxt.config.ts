import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineNuxtConfig( {
 vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')
        ]
      })
    ]
  },

  server: {
    host: '0.0.0.0', // デフォルト: localhost
    port: 8001, // デフォルト: 3000
  },

  build: {},

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.VUE_APP_URL,
      APIURL: process.env.VUE_APP_API_URL,
    },
  },

  modules: ['@nuxtjs/tailwindcss'],
  css: ["@/assets/tailwind.css"]
})
