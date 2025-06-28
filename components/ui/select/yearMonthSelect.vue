<template>
  <div class="w-64 flex justify-center items-center">
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const date = ref<string>("");



async function handleLogin() {
  console.log(100);
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
