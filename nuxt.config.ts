import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,  // 默認開啟 SSR，如果要禁用 SSR 可以設為 false
  app: {
    head: {
      title: "記帳系統",
    },
  },
  compatibilityDate: "2025-05-15",
  css: ["@/assets/css/index.scss", "sweetalert2/dist/sweetalert2.min.css", "@vuepic/vue-datepicker/dist/main.css"],
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome", "@nuxt/ui"],
  imports: {
    autoImport: true,
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
});
