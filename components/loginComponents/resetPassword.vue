<template>
  <UModal
    title="重設密碼"
    description="填寫以下重設資料"
    v-model:open="openresetpassword"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <UButton class="btn-aomidori" icon="i-ic:outline-save" label="Reset Password" @click="openresetpassword = true" />
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>

        <div>
          <div class="d-flex flex-row justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">使用者帳號：</span>
            <UInput class="col-span-3" v-model="userAccount" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userAccount">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入使用者帳號</span>
          </div>
        </div>

        <div>
          <div class="d-flex flex-row justify-start items-center grid grid-cols-6">
            <span class="col-start-1 col-end-3 text-right">原本密碼：</span>
            <UInput class="col-span-3" v-model="userOldPassword" type="password" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userOldPassword">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入密碼</span>
          </div>
        </div>

        <div>
          <div class="d-flex flex-row justify-start items-center grid grid-cols-6">
            <span class="col-start-1 col-end-3 text-right">新密碼：</span>
            <UInput class="col-span-3" v-model="userNewPassword" type="password" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userNewPassword">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入新密碼</span>
          </div>
        </div>

        <div>
          <div class="d-flex flex-row justify-start items-center grid grid-cols-6">
            <span class="col-start-1 col-end-3 text-right">重複新密碼：</span>
            <UInput class="col-span-3" v-model="userNewPasswordSecond" type="password" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.userNewPasswordSecond">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ secondPasswordValidateText }}</span>
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="userPasswordChange" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";

const openresetpassword = ref<boolean>(false);
const userAccount = ref<string>("");
const userOldPassword = ref<string>("");
const userNewPassword = ref<string>("");
const userNewPasswordSecond = ref<string>("");
const dataValidate = reactive<{ [key: string]: boolean }>({
  userAccount: true,
  userOldPassword: true,
  userNewPassword: true,
  userNewPasswordSecond: true,
});
const secondPasswordValidateText = ref<string>("");

function validateUserData() {
  dataValidate.userAccount = !!userAccount.value;
  dataValidate.userOldPassword = !!userOldPassword.value;
  dataValidate.userNewPassword = !!userNewPassword.value;
  dataValidate.userNewPasswordSecond = !!userNewPasswordSecond.value;
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

  if (dataValidate.userNewPassword !== dataValidate.userNewPasswordSecond) {
    dataValidate.userNewPasswordSecond = false;
    secondPasswordValidateText.value = "兩次密碼輸入不相同，請重新輸入";
    return false;
  }

  return true;
}

async function userPasswordChange() {
  if (!validateUserData()) return;
  //
}
</script>
<style lang="scss" scoped></style>
