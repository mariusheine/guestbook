// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-06',
  devtools: { enabled: true },
  telemetry: false,
  ssr: false,
  modules: ['@nuxt/ui', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Guestbook',
      titleTemplate: '%s',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  typescript: {
    strict: true,
  },
})
