// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // runtimeConfig: {
  //   public: {
  //     apiBase: process.env.NUXT_PUBLIC_API_BASE,
  //   },
  // },
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/icon"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // Run `cms:update` task every minute
      "59 23 * * *": ["daily_update"],
    },
  },
  compatibilityDate: "2024-11-27",
})
