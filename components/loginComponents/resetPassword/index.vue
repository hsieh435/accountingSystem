<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const account = ref<string>("");
const password = ref<string>("");





async function handleLogin() {
  console.log("登入資訊:", { account: account.value, password: password.value });
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
