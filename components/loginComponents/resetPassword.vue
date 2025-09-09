<template>
  <ui-buttonGroup :showSave="true" :saveText="'更改密碼'" @dataSave="userPasswordChange()" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const userAccount = ref<string>("");
const userName = ref<string>("");
const userOldPassword = ref<string>("");
const userNewPassword = ref<string>("");
const userNewPasswordSecond = ref<string>("");

async function userPasswordChange(apiMsg?: string) {

  Swal.fire({
    title: "重設使用者密碼",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>

        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">使用者帳號：</span>
          <input class="${tailwindStyles.inputClasses}" id="userAccount" value="${userAccount.value}" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">原本密碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="userOldPassword" value="${userOldPassword.value}" type="password" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">新密碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="userNewPassword" value="${userNewPassword.value}" type="password" />
        </div>

        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">重複新密碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="userNewPasswordSecond" value="${userNewPasswordSecond.value}" type="password" />
        </div>

      </div>
    `,
    confirmButtonText: "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    background: "#fff",
    allowOutsideClick: false,
    didOpen: () => {
      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      userAccount.value = (document.getElementById("userAccount") as HTMLInputElement).value;
      userOldPassword.value = (document.getElementById("userOldPassword") as HTMLInputElement).value;
      userNewPassword.value = (document.getElementById("userNewPassword") as HTMLInputElement).value;
      userNewPasswordSecond.value = (document.getElementById("userNewPasswordSecond") as HTMLInputElement).value;

      // 驗證單位代碼與單位名稱
      if (!userAccount.value) {
        errors.push("請填寫使用者帳號");
      }
      if (!userName.value) {
        errors.push("請填寫使用者名稱");
      }
      if (!userOldPassword.value) {
        errors.push("請填寫使用者密碼");
      }
      if (userNewPassword.value !== userNewPasswordSecond.value) {
        errors.push("兩次密碼不同");
      }
      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return {
        userAccount: userAccount.value,
        userOldPassword: userOldPassword.value,
        userNewPassword: userNewPassword.value,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value);
    }
  });
}
</script>
<style lang="scss" scoped></style>
