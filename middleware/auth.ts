// middleware/auth.ts
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";


export default defineNuxtRouteMiddleware((to, from) => {

    // console.log("Navigating from:", from.path);
    // console.log("Navigating to:", to.path);
    
//   const user = useAuthUser() // 自行實作的 composable
//   if (!user.value && to.path !== "/login") {
//     return navigateTo("/login")
//   }
})
