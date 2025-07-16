<template>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { IUserData } from "@/models/index";
import { navigateTo } from "nuxt/app";
import Swal from "sweetalert2";




declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "使用者資料設定",
});



const dataParams = reactive<IUserData>({
  userId: "",
  userName: "",
  userPassword: "",
});
const secondPassword = ref<string>("");



onMounted(() => {
  submitUserData();
});



async function submitUserData(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: "編輯使用者資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
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
          <span class="col-start-1 col-end-3 text-right">密碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="userPassword" value="${dataParams.userPassword}" type="password" />
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
      dataParams.userPassword = (document.getElementById("userPassword") as HTMLInputElement).value;
      secondPassword.value = (document.getElementById("secondPassword") as HTMLInputElement).value;


      if (!dataParams.userPassword) {
        errors.push("請填寫密碼");
      }
      if (dataParams.userPassword !== secondPassword.value) {
        errors.push("兩次密碼輸入不一致");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return { dataParams };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value.dataParams);
      navigateTo("/mainView");

    } else {
      // console.log("取消編輯使用者資料");
      navigateTo("/mainView");
    }
  });
};


</script>
<style lang="scss" scoped></style>
<!-- https://ui.nuxt.com/components/form -->
