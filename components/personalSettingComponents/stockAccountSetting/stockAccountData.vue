<template>
  <template v-if="props.stockAccountId">
    <ui-buttonGroup showView :viewText="'檢視證券帳戶'" @dataView="searchingStockAccountData()" />
  </template>
  <template v-if="!props.stockAccountId">
    <ui-buttonGroup showCreate :createText="'新增證券帳戶'" @dataCreate="stockAccountDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { getCurrentYMD } from "@/composables/tools";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ stockAccountId?: string; userId?: string; }>(), { stockAccountId: "", userId: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<{
  stockAccountId: string;
  userId: string;
  accountName: string;
  currencyAccountBankNo: string;
  currencyAccountBankName: string;
  minimumValueAllow: number;
  startingAmount: number;
  createdDate: string;
}>({
  stockAccountId: props.stockAccountId || "",
  userId: props.userId || "",
  accountName: "",
  currencyAccountBankNo: "",
  currencyAccountBankName: "",
  minimumValueAllow: 0,
  startingAmount: 0,
  createdDate: getCurrentYMD(),
});



async function searchingStockAccountData() {
  // 在這裡可以加入 API 呼叫來獲取存款帳戶資料
  // stockAccountDataHandling();  
}



async function stockAccountDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.stockAccountId ? "修改存款帳戶資料" : "新增存款帳戶資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">存款帳戶號碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="stockAccountId" value="${dataParams.stockAccountId}" ${props.stockAccountId ? `disabled` : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">存款帳戶名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountName" value="${dataParams.accountName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行代碼：</span>
          <input class="col-span-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currencyAccountBankNo" value="${dataParams.currencyAccountBankNo}" ${props.stockAccountId ? "disabled" : ""} />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currencyAccountBankName" value="${dataParams.currencyAccountBankName}" ${props.stockAccountId ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">初始金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.stockAccountId ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">最小允許金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="minimumValueAllow" value="${dataParams.minimumValueAllow}" type="number" />
        </div>


        ${props.stockAccountId ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="createdDate" value="${dataParams.createdDate}" disabled />
        </div>` : 
        ""}

      </div>
    `,
    confirmButtonText: props.stockAccountId ? "修改" : "新增",
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

      dataParams.stockAccountId = (document.getElementById("stockAccountId") as HTMLInputElement).value;
      dataParams.accountName = (document.getElementById("accountName") as HTMLInputElement).value;
      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllow = Number((document.getElementById("minimumValueAllow") as HTMLInputElement).value);


      if (!dataParams.stockAccountId) {
        errors.push("請填寫存款帳戶號碼");
      }

      if (!dataParams.accountName) {
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
      console.log("result:", result);

    }
  });
};


</script>
<style lang="scss" scoped></style>
