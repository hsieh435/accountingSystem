<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">記帳系統登入</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">帳號</label>
          <input class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="account" type="text" required />
        </div>
        <div class="mb-6">
          <label class="block text-gray-600 mb-1">密碼</label>
          <input class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="password" type="password" required />
        </div>
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" type="submit">
          <!-- <font-awesome-icon :icon="['fas', 'right-to-bracket']" /> -->
          <span>登入</span>
        </button>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
// import { setLocalStorageItem, getLocalStorageItem } from "@/composables/tools"
import { encryptString } from "@/composables/crypto"



declare function definePageMeta(meta: any): void;


const account = ref<string>("");
const password = ref<string>("");



definePageMeta({
  layout: "empty"
})



function handleLogin() {
  // encryptString
  console.log("account:", account.value);
  console.log("password:", encryptString(password.value));
  // 在此加入 API 呼叫與驗證邏輯
};
</script>
<style lang="scss" scoped></style>
