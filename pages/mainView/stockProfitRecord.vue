<template>
  <div class="flex-col justify-start items-center">
    <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
      <!--  -->
    </div>
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
  functionTitle: "財務報表",
  subTitle: "獲利紀錄",
});



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
