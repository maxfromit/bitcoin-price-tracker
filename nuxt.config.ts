// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Bitcoin Price Tracker",
    },
  },

  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/icon", "nuxt-highcharts"],

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
