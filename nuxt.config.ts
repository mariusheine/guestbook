// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/ui'],
  runtimeConfig: {
    database: './.data/guestbook.db',
    migrationsPath: './migrations',
    openaiApiKey: '',
    public: {
      partyContext: ''
    }
  },
})
