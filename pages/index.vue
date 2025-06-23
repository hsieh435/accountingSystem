<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">登入帳號</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">帳號</label>
          <input class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="email" type="text" required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-600 mb-1">密碼</label>
          <input class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="password" type="password" required />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">登入</button>
      </form>
    </div>
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
<style scoped>
/* You can add scoped styles here if needed */
</style>
