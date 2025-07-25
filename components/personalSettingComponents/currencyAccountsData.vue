<template>
  <template v-if="props.currencyAccountIdGot">
    <ui-buttonGroup showView :viewText="'檢視存款帳戶'" @dataView="searchingCurrencyAccountData()" />
  </template>
  <template v-if="!props.currencyAccountIdGot">
    <ui-buttonGroup showCreate :createText="'新增存款帳戶'" @dataCreate="currencyAccountDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { ICurrencyAccountList } from "@/models/index";
import { getCurrentYMD } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ currencyAccountIdGot?: string; }>(), { currencyAccountIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ICurrencyAccountList>({
  accountId: props.currencyAccountIdGot || "",
  userId: "",
  accountType: "",
  accountName: "",
  accountBankCode: "",
  accountBankName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  isSalaryAccount: false,
  createdDate: getCurrentYMD(),
});



async function searchingCurrencyAccountData() {
  currencyAccountDataHandling();
}



async function currencyAccountDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.currencyAccountIdGot ? "修改存款帳戶資料" : "新增存款帳戶資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>存款帳戶號碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="accountId" value="${dataParams.accountId}" ${props.currencyAccountIdGot ? `disabled` : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>存款帳戶名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="accountName" value="${dataParams.accountName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>銀行代碼：</span>
          <input class="col-span-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountBankCode" value="${dataParams.accountBankCode}" ${props.currencyAccountIdGot ? "disabled" : ""} />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>銀行名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="accountBankName" value="${dataParams.accountBankName}" ${props.currencyAccountIdGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.currencyAccountIdGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最小允許金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-center items-center w-full my-2">
          <div class="mx-2">
            <input class="border border-gray-300 mx-1" id="openAlert" value="${dataParams.openAlert}" type="checkbox" />
            <label for="openAlert">開啟提醒</label>
          </div>
          <div class="mx-2">
            <input class="border border-gray-300 mx-1" id="isSalaryAccount" value="${dataParams.isSalaryAccount}" type="checkbox" />
            <label for="isSalaryAccount">薪資帳戶</label>
          </div>
        </div>


        ${props.currencyAccountIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="${tailwindStyles.inputClasses}" id="createdDate" value="${dataParams.createdDate}" disabled />
        </div>` :
        ""}

      </div>
    `,
    confirmButtonText: props.currencyAccountIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
    background: "#fff",
    allowOutsideClick: false,
    didOpen: () => {

      const minimumValueAllowed = document.getElementById("minimumValueAllowed") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      minimumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        // 
      }

      const isSalaryAccountCheckbox = document.getElementById("isSalaryAccount") as HTMLInputElement;
      isSalaryAccountCheckbox.checked = dataParams.isSalaryAccount;
      
      const openAlertCheckbox = document.getElementById("openAlert") as HTMLInputElement;
      openAlertCheckbox.checked = dataParams.openAlert;

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.accountId = (document.getElementById("accountId") as HTMLInputElement).value;
      dataParams.accountName = (document.getElementById("accountName") as HTMLInputElement).value;
      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number((document.getElementById("minimumValueAllowed") as HTMLInputElement).value);
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.openAlert = Boolean((document.getElementById("openAlert") as HTMLInputElement).checked);
      dataParams.isSalaryAccount = Boolean((document.getElementById("isSalaryAccount") as HTMLInputElement).checked);


      if (!dataParams.accountId) {
        errors.push("請填寫存款帳戶號碼");
      }
      if (!dataParams.accountName) {
        errors.push("請填寫存款帳戶名稱");
      }
      if (!dataParams.accountBankCode) {
        errors.push("請填寫銀行代碼");
      }
      if (!dataParams.accountBankName) {
        errors.push("請填寫銀行名稱");
      }
      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫帳戶初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed)) {
        errors.push("請填寫帳戶最小允許金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (dataParams.alertValue < dataParams.minimumValueAllowed) {
        errors.push("提醒金額不得低於最小允許金額");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return dataParams;
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value);

    }
  });
};


</script>
<style lang="scss" scoped></style>
