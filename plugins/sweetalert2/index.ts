import Swal from "sweetalert2";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      swal: Swal
    }
  }
})