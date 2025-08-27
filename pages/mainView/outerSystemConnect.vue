<template>
  <div class="flex justify-center items-center w-full">
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
  functionTitle: "資訊查詢",
  subTitle: "連線測試",
})



onMounted(() => {
  // navigateTo("/mainView");
});



</script>
<style lang="scss" scoped></style>
