// import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css", "sweetalert2/dist/sweetalert2.min.css", "@/assets/css/main.css"],
  modules: ["@nuxtjs/tailwindcss", "@vesp/nuxt-fontawesome", "@nuxt/ui"],
  imports: {
    autoImport: true
  }
})
