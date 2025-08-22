import { defineNuxtConfig } from "nuxt/config";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "記帳系統",
    },
  },
  compatibilityDate: "2025-05-15",
  css: ["@/assets/css/index.scss", "sweetalert2/dist/sweetalert2.min.css", "@vuepic/vue-datepicker/dist/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome", "@nuxt/ui", ["nuxt-plotly", { inject: true }]],
  imports: {
    autoImport: true,
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"]
    }
  }
});
