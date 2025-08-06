import { defineNuxtConfig } from "nuxt/config";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "記帳系統",
    },
  },
  compatibilityDate: "2025-05-15",
  css: ["@/assets/css/index.scss", "sweetalert2/dist/sweetalert2.min.css"],
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome", "@nuxt/ui"],
  imports: {
    autoImport: true,
  },
})
