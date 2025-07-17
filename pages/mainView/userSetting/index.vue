<template>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { IUserData, IResponse } from "@/models/index";
import { navigateTo } from "nuxt/app";
import { jwtTokenEncoded } from "@/server";
import { fetchUserDataChange } from "@/server/userDataApi";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import { encryptString } from "@/composables/crypto";
import Swal from "sweetalert2";




declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "使用者資料設定",
});



const dataParams = reactive<IUserData>({
  userId: "",
  userName: "",
  userOldPassword: "",
  userNewPassword: "",
});
const secondPassword = ref<string>("");



onMounted(() => {
  dataParams.userId = jwtTokenEncoded()?.payload?.userId ?? "";
  dataParams.userName = jwtTokenEncoded()?.payload?.userName ?? "";
  submitUserData();
});



async function submitUserData(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: "編輯使用者資料",
    html: `
      <div class="items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">使用者代碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="userId" value="${dataParams.userId}" disabled />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">使用者姓名：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="userName" value="${dataParams.userName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">舊密碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="userOldPassword" value="${dataParams.userOldPassword}" type="password" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">新密碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="userNewPassword" value="${dataParams.userNewPassword}" type="password" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">確認密碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="secondPassword" value="${secondPassword.value}" type="password" />
        </div>

      </div>
    `,
    confirmButtonText: "修改",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
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

      dataParams.userId = (document.getElementById("userId") as HTMLInputElement).value;
      dataParams.userName = (document.getElementById("userName") as HTMLInputElement).value;
      dataParams.userOldPassword = (document.getElementById("userOldPassword") as HTMLInputElement).value;
      dataParams.userNewPassword = (document.getElementById("userNewPassword") as HTMLInputElement).value;
      secondPassword.value = (document.getElementById("secondPassword") as HTMLInputElement).value;


      if (!dataParams.userName) {
        errors.push("請填寫使用者姓名");
      }
      if (!dataParams.userOldPassword) {
        errors.push("請填寫舊密碼");
      }
      if (!dataParams.userNewPassword || !secondPassword.value) {
        errors.push("請填寫新密碼");
      }
      if ((!dataParams.userNewPassword || !secondPassword.value) && dataParams.userNewPassword !== secondPassword.value) {
        errors.push("兩次密碼輸入不一致");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return dataParams;
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      result.value.userOldPassword = encryptString(result.value.userOldPassword);
      result.value.userNewPassword = encryptString(result.value.userNewPassword);
      console.log("result:", result.value);
      
      try {
        const res = await fetchUserDataChange(result.value) as IResponse;
        console.log("res:", res);
        if (res.returnCode === 0) {
          showAxiosToast({ message: res.message });
          navigateTo("/mainView");
        } else {
          showAxiosErrorMsg({ message: res.message });
        } 
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      } finally {
        navigateTo("/mainView");
      }
    } else {
      navigateTo("/mainView");
    }
  });
};


</script>
<style lang="scss" scoped></style>
<!-- https://ui.nuxt.com/components/form -->
