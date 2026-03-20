import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true, // 默認開啟 SSR，如果要禁用 SSR 可以設為 false
  app: {
    head: {
      title: "Accounting System",
    },
  },
  compatibilityDate: "2025-05-15",
  components: true,
  css: [
    "@/assets/css/index.scss",
    "~/node_modules/sweetalert2/dist/sweetalert2.min.css",
    "~/node_modules/@vuepic/vue-datepicker/dist/main.css",
  ],
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/ui"],
  imports: {
    autoImport: true,
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  plugins: ["@/plugins/fontawesome"],
  vite: {
    server: {
      fs: {
        allow: [".."], // allow serving files from one level up (covers node_modules)
      },
    },
  },
});
