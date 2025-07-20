<template>    
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white rounded-xl shadow-md w-full max-w-sm p-8">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">登入</h2>
        
      <div class="my-4">
        <label class="block text-gray-600 mb-1">帳號：</label>
        <input class="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2" v-model="accountId" type="search" required />
      </div>

      <div class="mb-6">
        <label class="block text-gray-600 mb-1">密碼：</label>
        <input class="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2" v-model="password" type="password" required />
      </div>

      <div class="flex justify-center items-center">
        <button class="btn-ruri" color="secondary" @click="handleLogin()" type="button">
          <font-awesome-icon class="mx-1" :icon="['fas', 'right-to-bracket']" /><span class="mx-1">登入</span>
        </button>
        <loginComponents-resetPassword />
      </div>
    </div>
    <!-- <loginComponents-createUser /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IResponse } from "@/models";
import { fetchUserLogin } from "@/server/userDataApi";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import { navigateTo } from "nuxt/app";
import { setLocalStorageItem } from "@/composables/tools";
import { encryptString } from "@/composables/crypto";



declare function definePageMeta(meta: any): void;
definePageMeta({
  layout: false, 
})



const accountId = ref<string>("");
const password = ref<string>("");



async function handleLogin() {
  try {
    const res = await fetchUserLogin({
      userId: accountId.value,
      password: encryptString(password.value),
    }) as IResponse;
    console.log("res:", res);
    if (res.data.returnCode === 0) {
      showAxiosToast({ message: res.data.message });
      setLocalStorageItem("userToken", res.data.data.jwt);
      navigateTo("/mainView");
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
};
</script>
<style lang="scss" scoped></style>
