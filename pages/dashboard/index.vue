<template>
  <div class="flex items-start justify-start min-h-screen bg-gray-100">
    <!-- 00000000 -->
    <NuxtLayout name="front-end">
      <span>abcdefghij</span>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const account = ref<string>("");
const password = ref<string>("");



declare function definePageMeta(meta: any): void;
// definePageMeta({
//   layout: "frontEnd"
// })



async function handleLogin() {
  console.log(100);
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
