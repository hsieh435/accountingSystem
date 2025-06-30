import axios from "axios"
import { defineNuxtPlugin, useRuntimeConfig, useCookie } from "nuxt/app"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const axiosInstance = axios.create({
    baseURL: typeof config.public.apiBase === "string" && config.public.apiBase.length > 0
      ? config.public.apiBase
      : "http://localhost:8080/api",
    timeout: 5000,
    headers: { "Content-Type": "application/json;charset=utf-8" }
  })

  axiosInstance.interceptors.request.use((res) => {
    const token = useCookie("token").value;
    if (token) {
      res.headers.Authorization = `Bearer ${token}`;
    }
    return res;
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})


// 參考資料：
// https://imall.dev/vue-note/vue-axios-proxy/
// https://medium.com/i-am-mike/%E4%BD%BF%E7%94%A8axios%E6%99%82%E4%BD%A0%E7%9A%84api%E9%83%BD%E6%80%8E%E9%BA%BC%E7%AE%A1%E7%90%86-557d88365619
