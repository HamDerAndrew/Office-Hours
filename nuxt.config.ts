export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  modules: ['@pinia/nuxt', '@nuxt/image'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  routeRules: {},

  nitro: {
    // Netlify preset auto-detected on deploy.
  },
})
