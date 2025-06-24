<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
  </div>
</template>
<script setup lang="ts">
const email = ref<string>("");
const password = ref<string>("");

function handleLogin() {
  console.log("登入資訊:", { email: email.value, password: password.value });
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
