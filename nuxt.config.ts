// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Vue Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  // Configure static page generation
  ssr: true,
  routeRules: {
    '/**': { static: true }
  },
  // Cloudflare Pages specific configuration
  nitro: {
    preset: 'cloudflare-pages'
  }
})