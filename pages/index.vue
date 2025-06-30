<template>    
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-xl shadow-md w-full max-w-sm p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">登入</h2>
      <div class="flex-row justify-center items-center">
        
        <div class="my-4">
          <label class="block text-gray-600 mb-1">帳號：</label>
          <input class="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2" v-model="account" type="search" required />
        </div>

        <div class="mb-6">
          <label class="block text-gray-600 mb-1">密碼：</label>
          <input class="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2" v-model="password" type="password" required />
        </div>

        <div class="flex justify-center items-center">
          <button class="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mx-2 px-2 py-1" @click="handleLogin()" type="button">
            <font-awesome-icon class="mx-1" :icon="['fas', 'right-to-bracket']" /><span class="mx-1">登入</span>
          </button>
          <loginComponents-resetPassword />
        </div>
      </div>
    </div>
    <!-- <loginComponents-createUser /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { encryptString } from "@/composables/crypto"
import { showAxiosToast } from "@/composables/swalDialog"
import { navigateTo } from "nuxt/app";



declare function definePageMeta(meta: any): void;


const account = ref<string>("");
const password = ref<string>("");



definePageMeta({
  layout: false, 
})



async function handleLogin() {
  console.log("account:", account.value);
  console.log("password:", encryptString(password.value));
  // 在此加入 API 呼叫與驗證邏輯

  showAxiosToast({ message: "登入成功", });

  await navigateTo("/mainView");
};
</script>
<style lang="scss" scoped></style>
