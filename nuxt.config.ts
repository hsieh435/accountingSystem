import tailwindcss from "@tailwindcss/vite";



// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css", "sweetalert2/dist/sweetalert2.min.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
