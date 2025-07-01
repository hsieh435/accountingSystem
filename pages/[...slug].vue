<template>
  <div class="flex items-center justify-center min-h-screen w-full">
    <h1>404 - Page Not Found</h1>
    <!-- <UError
      redirect="/mainView"
      :error="{
        statusMessage: 'Page not found',
        message: 'The page you are looking for does not exist.'
        }" /> -->
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { navigateTo } from "nuxt/app";
import { useRoute } from "vue-router"
import { createError } from "h3"



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


declare function definePageMeta(meta: any): void;

definePageMeta({
  layout: "empty-layout",
})


onMounted(() => {
  console.log("404 Page Not Found");
  // navigateTo("/mainView");
});


</script>
<style lang="scss" scoped></style>
