<template>
  <UModal
    title="使用者資料設定"
    description="修改資料"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <UButton class="hidden" />
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>

        <div class="flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">使用者代碼：</span>
          <UInput class="col-span-3" id="userId" v-model="dataParams.userId" disabled />
        </div>

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">使用者姓名：</span>
            <UInput
              :class="['col-span-3', dataValidate.userName ? '' : 'outline-1 outline-red-500']"
              id="userName"
              v-model="dataParams.userName"
              type="search" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入使用者姓名</span>
          </div>
        </div>

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">舊密碼：</span>
            <UInput
              :class="['col-span-3', dataValidate.userOldPassword ? '' : 'outline-1 outline-red-500']"
              id="userOldPassword"
              v-model="dataParams.userOldPassword"
              type="password" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userOldPassword">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入舊密碼</span>
          </div>
        </div>

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">新密碼：</span>
            <UInput
              :class="['col-span-3', dataValidate.userNewPassword ? '' : 'outline-1 outline-red-500']"
              id="userNewPassword"
              v-model="dataParams.userNewPassword"
              type="password" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userNewPassword">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入新密碼</span>
          </div>
        </div>

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">確認密碼：</span>
            <UInput
              :class="['col-span-3', dataValidate.secondPassword ? '' : 'outline-1 outline-red-500']"
              id="secondPassword"
              v-model="dataParams.secondPassword"
              type="password" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.secondPassword">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ secondPasswordValidateText }}</span>
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="submitUserData" />
          <ui-buttonGroup showClose @dataClose="open = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { onMounted, watch, reactive, ref } from "vue";
import { IUserData, IResponse } from "@/models/index.ts";
import { navigateTo } from "nuxt/app";
import { jwtTokenEncoded } from "@/server/index.ts";
import { fetchUserDataChange } from "@/server/userDataApi.ts";
import { setLocalStorageItem } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import { encryptString } from "@/composables/crypto.ts";
// import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "使用者資料設定",
});

const open = ref<boolean>(true);
const dataParams = reactive<IUserData>({
  userId: "",
  userName: "",
  userOldPassword: "",
  userNewPassword: "",
  secondPassword: "",
});
const dataValidate = reactive<any>({
  userId: true,
  userName: true,
  userOldPassword: true,
  userNewPassword: true,
  secondPassword: true,
});
const secondPasswordValidateText = ref<string>("");

onMounted(() => {
  dataParams.userId = jwtTokenEncoded()?.payload?.userId ?? "";
  dataParams.userName = jwtTokenEncoded()?.payload?.userName ?? "";
});

watch(open, () => {
  if (open.value === false) {
    navigateTo("/mainView");
  }
});

function validateUserData() {
  dataValidate.userName = !!dataParams.userName;
  dataValidate.userOldPassword = !!dataParams.userOldPassword;
  dataValidate.userNewPassword = !!dataParams.userNewPassword;
  dataValidate.secondPassword = !!dataParams.secondPassword;
  secondPasswordValidateText.value = "";

  if (
    !dataValidate.userName ||
    !dataValidate.userOldPassword ||
    !dataValidate.userNewPassword ||
    !dataValidate.secondPassword
  ) {
    if (!dataValidate.secondPassword) {
      secondPasswordValidateText.value = "請再次輸入新密碼";
    }
    return false;
  }

  if (dataParams.userNewPassword !== dataParams.secondPassword) {
    dataValidate.secondPassword = false;
    secondPasswordValidateText.value = "兩次密碼輸入不相同，請重新輸入";
    return false;
  }

  return true;
}

async function submitUserData() {
  if (!validateUserData()) return;

  dataParams.userOldPassword = encryptString(dataParams.userOldPassword);
  dataParams.userNewPassword = encryptString(dataParams.userNewPassword);

  try {
    const res: IResponse = await fetchUserDataChange(dataParams);
    messageToast(res.data.message);
    setLocalStorageItem("userToken", res.data.data.jwt);
    open.value = false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
<!-- https://ui.nuxt.com/components/form -->
