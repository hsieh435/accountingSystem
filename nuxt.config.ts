import { defineNuxtConfig } from "nuxt/config";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.scss", "sweetalert2/dist/sweetalert2.min.css"],
  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome", "@nuxt/ui"],
  imports: {
    autoImport: true,
  },
  app: {
    head: {
      title: "記帳系統",
    },
  },
})
