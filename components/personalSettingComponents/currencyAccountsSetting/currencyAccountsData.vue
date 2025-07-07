<template>
  <template v-if="props.currencyAccountIdGot">
    <ui-buttonGroup showView :viewText="'檢視存款帳戶'" @dataView="searchingCurrencyAccountData()" />
  </template>
  <template v-if="!props.currencyAccountIdGot">
    <ui-buttonGroup showCreate :createText="'新增存款帳戶'" @dataCreate="currencyAccountDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { getCurrentYMD } from "@/composables/tools";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ currencyAccountIdGot?: string; userIdGot?: string; }>(), { currencyAccountIdGot: "", userIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<{
  currencyAccountId: string;
  userId: string;
  currencyAccountName: string;
  currencyAccountBankNo: string;
  currencyAccountBankName: string;
  startingAmount: number;
  minimumValueAllow: number;
  isSalaryAccount: boolean;
  createdDate: string;
}>({
  currencyAccountId: props.currencyAccountIdGot || "",
  userId: props.userIdGot || "",
  currencyAccountName: "",
  currencyAccountBankNo: "",
  currencyAccountBankName: "",
  startingAmount: 0,
  minimumValueAllow: 0,
  isSalaryAccount: true,
  createdDate: getCurrentYMD(),
});



async function searchingCurrencyAccountData() {
  // 在這裡可以加入 API 呼叫來獲取存款帳戶資料
  // currencyAccountDataHandling();  
}



async function currencyAccountDataHandling(apiMsg?: string) {
  console.log(dataParams);

  Swal.fire({
    title: props.currencyAccountIdGot ? "修改存款帳戶資料" : "新增存款帳戶資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">存款帳戶號碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currencyAccountId" value="${dataParams.currencyAccountId}" ${props.currencyAccountIdGot ? `disabled` : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">存款帳戶名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currencyAccountName" value="${dataParams.currencyAccountName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行代碼：</span>
          <input class="col-span-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currencyAccountBankNo" value="${dataParams.currencyAccountBankNo}" ${props.currencyAccountIdGot ? "disabled" : ""} />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currencyAccountBankName" value="${dataParams.currencyAccountBankName}" ${props.currencyAccountIdGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">初始金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.currencyAccountIdGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">最小允許金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="minimumValueAllow" value="${dataParams.minimumValueAllow}" type="number" />
        </div>
        

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">薪資帳戶：</span>
          <div class="flex justify-start items-center">
            <input id="isSalaryAccountY" name="isSalaryAccount" type="radio" value="${true}" />
            <label class="ms-1 me-5" for="isSalaryAccountY">是</label>

            <input id="isSalaryAccountN" name="isSalaryAccount" type="radio" value="${false}" />
            <label class="ms-1 me-5" for="isSalaryAccountN">否</label>
          </div>
        </div>


        ${props.currencyAccountIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="createdDate" value="${dataParams.createdDate}" disabled />
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
      
      const yesRadio = document.getElementById("isSalaryAccountY") as HTMLInputElement;
      const noRadio = document.getElementById("isSalaryAccountN") as HTMLInputElement;
      
      if (dataParams.isSalaryAccount === true) {
        yesRadio.checked = true;
      } else {
        noRadio.checked = true;
      }


      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.currencyAccountId = (document.getElementById("currencyAccountId") as HTMLInputElement).value;
      dataParams.currencyAccountName = (document.getElementById("currencyAccountName") as HTMLInputElement).value;
      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllow = Number((document.getElementById("minimumValueAllow") as HTMLInputElement).value);
      dataParams.isSalaryAccount = ((document.querySelector(`input[name="isSalaryAccount"]:checked`) as HTMLInputElement).value === "true");


      if (!dataParams.currencyAccountId) {
        errors.push("請填寫存款帳戶號碼");
      }

      if (!dataParams.currencyAccountName) {
        errors.push("請填寫存款帳戶名稱");
      }

      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫帳戶初始金額");
      }

      if (isNaN(dataParams.minimumValueAllow)) {
        errors.push("請填寫帳戶最小允許金額");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return { dataParams };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value);

    }
  });
};


</script>
<style lang="scss" scoped></style>
