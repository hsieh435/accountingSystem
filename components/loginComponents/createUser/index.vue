<template>
  <div></div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchUserList } from "@/server/userDataApi";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const userAccount = ref<string>("");
const userName = ref<string>("");
const userPassword = ref<string>("");
const userSsecondPassword = ref<string>("");



onMounted(async () => {
  // console.log("onMounted props:", props);
  await searchingUser()
});



async function searchingUser() {
  if (await fetchUserList() === 0) {
    await createUserDate();
  }
}



async function createUserDate(apiMsg?: string) {

  Swal.fire({
    title: "新增使用者資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>

        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">使用者帳號：</span>
          <input class="${tailwindStyles.inputClasses}" id="userAccount" value="${userAccount.value}" />
        </div>


        <div class="d-flex flex-row grid justify-start items-center grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">使用者名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="userName" value="${userName.value}" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">使用者密碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="userPassword" value="${userPassword.value}" type="password" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">重複密碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="userSsecondPassword" value="${userSsecondPassword.value}" type="password" />
        </div>

      </div>
    `,
    confirmButtonText: `<i class="bi bi-plus-lg mx-1"></i>新增`,
    showCancelButton: true,
    cancelButtonText: `<i class="bi bi-x-lg mx-1"></i>取消`,
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

      userAccount.value = (document.getElementById("userAccount") as HTMLInputElement).value;
      userName.value = (document.getElementById("userName") as HTMLInputElement).value;
      userPassword.value = (document.getElementById("userPassword") as HTMLInputElement).value;
      userSsecondPassword.value = (document.getElementById("userSsecondPassword") as HTMLInputElement).value;


      // 驗證單位代碼與單位名稱
      if (!userAccount.value) {
        errors.push("請填寫使用者帳號");
      }

      if (!userName.value) {
        errors.push("請填寫使用者名稱");
      }

      if (!userPassword.value) {
        errors.push("請填寫使用者密碼");
      }

      if (userPassword.value !== userSsecondPassword.value) {
        errors.push("兩次密碼不同");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return {
        userAccount: userAccount.value,
        userName: userName.value,
        userPassword: userPassword.value,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value);

    }
  });
};



</script>
<style lang="scss" scoped></style>
