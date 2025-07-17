<template>
  <div class="flex justify-center items-center w-full">
    <h1>404 - Page Not Found</h1>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
// import { navigateTo } from "nuxt/app";
import { useRoute } from "vue-router"
import { createError } from "h3"



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "404 Not Found",
  subTitle: "",
})



// Handle unknown routes including DevTools requests
const route = useRoute();
// Silently handle DevTools requests
if (route.path.includes(".well-known")) {
  
  throw createError({
    statusCode: 404,
    statusMessage: "Not Found",
    fatal: false
  })
}



onMounted(() => {
  // navigateTo("/mainView");
});



</script>
<style lang="scss" scoped></style>
