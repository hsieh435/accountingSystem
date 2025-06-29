<template>
  <div class="w-64 flex justify-center items-center">
    <label class="block text-sm font-medium text-gray-700 mx-1">帳戶：</label>
    <select class="block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white mx-1 px-2 py-1" v-model="accountId">
      <option value="">請選擇</option>
      <option value="category1">Category 1</option>
      <option value="category2">Category 2</option>
      <option value="category3">Category 3</option>
    </select>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const accountId = ref<string>("");
const password = ref<string>("");



async function handleLogin() {
  console.log(100);
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
