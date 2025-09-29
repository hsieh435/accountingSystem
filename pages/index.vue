<template>
  <div class="min-h-screen bg-green-100 flex justify-center items-center overflow-hidden py-6 py-12">
    <div class="relative py-3">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 transform -rotate-6 rounded-3xl"></div>
      <div class="relative bg-white rounded-3xl p-20">
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold">記帳系統登入</h1>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-10 text-gray-700 text-lg leading-7">
              <div class="relative">
                <input
                  :class="inputClasses"
                  id="account"
                  name="account"
                  v-model="accountId"
                  type="search"
                  placeholder=""
                  autocomplete="off"
                  v-on:keyup.enter="handleLogin" />
                <label :class="labelClasses" for="account">帳號：</label>
              </div>
              <div class="relative">
                <input
                  :class="inputClasses"
                  id="password"
                  name="password"
                  v-model="password"
                  type="password"
                  placeholder=""
                  autocomplete="off"
                  v-on:keyup.enter="handleLogin" />
                <label :class="labelClasses" for="password">密碼：</label>
              </div>
              <div class="flex justify-center items-center">
                <UButton class="btn-ruri" @click="handleLogin()" type="button">
                  <font-awesome-icon class="mx-1" :icon="['fas', 'right-to-bracket']" /><span class="mx-1">登入</span>
                </UButton>
                <loginComponents-resetPassword />
                <loginComponents-createUser />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IResponse } from "@/models/index.ts";
import { fetchUserLogin } from "@/server/userDataApi";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";
import { navigateTo } from "nuxt/app";
import { setLocalStorageItem } from "@/composables/tools";
import { encryptString } from "@/composables/crypto";

declare function definePageMeta(meta: any): void;
definePageMeta({
  layout: false,
});

const inputClasses =
  "peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600";
const labelClasses =
  "absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm";
const accountId = ref<string>("");
const password = ref<string>("");

async function handleLogin() {
  try {
    const res: IResponse = await fetchUserLogin({
      userId: accountId.value,
      password: encryptString(password.value),
    });
    // console.log("res:", res);
    if (res.data.returnCode === 0) {
      messageToast({ message: res.data.message });
      setLocalStorageItem("userToken", res.data.data.jwt);
      navigateTo("/mainView");
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
