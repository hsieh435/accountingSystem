<template>
  <UModal
    title="建立新使用者"
    description="帳號密碼設定"
    v-model:open="openTradeData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">使用者帳號：</span>
            <div :class="['w-full col-span-4', dataValidate.userAccount ? '' : 'outline-1 outline-red-500']">
              <UInput class="w-full" id="userAccount" v-model="userAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userAccount">
            <span class="col-start-3 col-span-4 text-red-500">請填寫帳號</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">使用者名稱：</span>
            <div :class="['w-full col-span-4', dataValidate.userName ? '' : 'outline-1 outline-red-500']">
              <UInput class="w-full" id="userName" v-model="userName" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userName">
            <span class="col-start-3 col-span-4 text-red-500">請填寫使用者名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">使用者密碼：</span>
            <div :class="['w-full col-span-4', dataValidate.userPassword ? '' : 'outline-1 outline-red-500']">
              <UInput class="w-full" id="userPassword" v-model="userPassword" type="password" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userPassword">
            <span class="col-start-3 col-span-4 text-red-500">請填寫使用者密碼</span>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">確認密碼：</span>
            <div :class="['w-full col-span-4', dataValidate.userSsecondPassword ? '' : 'outline-1 outline-red-500']">
              <UInput class="w-full" id="userSsecondPassword" v-model="userSsecondPassword" type="password" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userSsecondPassword">
            <span class="col-start-3 col-span-4 text-red-500">請確認密碼</span>
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave :saveText="'建立使用者'" @dataSave="createUserDate" />
          <ui-buttonGroup showClose @dataClose="openTradeData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { fetchUserList, fetchUserCreate } from "@/server/userDataApi.ts";
import { IResponse } from "@/models/index.ts";
import { encryptString } from "@/composables/crypto.ts";
import { messageToast } from "@/composables/swalDialog.ts";

const openTradeData = ref<boolean>(true);
const userAccount = ref<string>("");
const userName = ref<string>("");
const userPassword = ref<string>("");
const userSsecondPassword = ref<string>("");
const dataValidate = reactive<{ [key: string]: boolean }>({
  userAccount: true,
  userName: true,
  userPassword: true,
  userSsecondPassword: true,
});

onMounted(async () => {
  // console.log("onMounted props:", props);
  await searchingUser();
});

async function searchingUser() {
  if ((await fetchUserList()) === 0) {
    openTradeData.value = true;
  }
}

async function createUserDate() {
  dataValidate.userAccount = true;
  dataValidate.userName = true;
  dataValidate.userPassword = true;
  dataValidate.userSsecondPassword = true;

  if (!userAccount.value) {
    dataValidate.userAccount = false;
  }
  if (!userName.value) {
    dataValidate.userName = false;
  }
  if (!userPassword.value) {
    dataValidate.userPassword = false;
  }
  if (userPassword.value !== userSsecondPassword.value) {
    dataValidate.userSsecondPassword = false;
  }

  if (
    dataValidate.userAccount === true &&
    dataValidate.userName === true &&
    dataValidate.userPassword === true &&
    dataValidate.userSsecondPassword === true
  ) {
    try {
      const res: IResponse = await fetchUserCreate({
        userAccount: userAccount.value,
        userName: userName.value,
        userPassword: encryptString(userPassword.value),
      });
      messageToast({ message: res.data.message });
    } catch (error) {
      messageToast({ message: (error as Error).message, icon: "error" });
    }
  }
}
</script>
<style lang="scss" scoped></style>
