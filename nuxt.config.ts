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

  app: {
    head: {
      title: 'Northwall Digital — Web engineering across the stack',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Northwall Digital is a digital technology contractor delivering web platforms across every stack — from frontend to cloud, mobile to AI.',
        },
        { name: 'theme-color', content: '#0b1320' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      officesApiBase: 'https://jakobacademyproject.euwest01.umbraco.io',
    },
  },

  routeRules: {
    // Personalized by user timezone — render on each request, no caching.
    '/': { ssr: true },
    // Static marketing pages: build-time render.
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },

  nitro: {
    // Netlify preset auto-detected on deploy.
  },
})
