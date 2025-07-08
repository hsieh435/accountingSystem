<template>
  <template v-if="props.stockAccountIGot">
    <ui-buttonGroup showView :viewText="'檢視證券帳戶'" @dataView="searchingStockAccountData()" />
  </template>
  <template v-if="!props.stockAccountIGot">
    <ui-buttonGroup showCreate :createText="'新增證券帳戶'" @dataCreate="stockAccountDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { IStockAccountList } from "@/models/index";
import { getCurrentYMD } from "@/composables/tools";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ stockAccountIGot?: string; userIdGot?: string; }>(), { stockAccountIGot: "", userIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<IStockAccountList>({
  accountId: props.stockAccountIGot || "",
  userId: props.userIdGot || "",
  accountName: "",
  accountType: "",
  accountBankCode: "",
  accountBankName: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  createdDate: getCurrentYMD(),
});



async function searchingStockAccountData() {
  // 在這裡可以加入 API 呼叫來獲取存款帳戶資料
  // stockAccountDataHandling();  
}



async function stockAccountDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.stockAccountIGot ? "修改存款帳戶資料" : "新增存款帳戶資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">存款帳戶號碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountId" value="${dataParams.accountId}" ${props.stockAccountIGot ? `disabled` : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">存款帳戶名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountName" value="${dataParams.accountName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行代碼：</span>
          <input class="col-span-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountBankCode" value="${dataParams.accountBankCode}" ${props.stockAccountIGot ? "disabled" : ""} />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountBankName" value="${dataParams.accountBankName}" ${props.stockAccountIGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">初始金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.stockAccountIGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">最小允許金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>


        ${props.stockAccountIGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="createdDate" value="${dataParams.createdDate}" disabled />
        </div>` : 
        ""}

      </div>
    `,
    confirmButtonText: props.stockAccountIGot ? "修改" : "新增",
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

      dataParams.accountId = (document.getElementById("accountId") as HTMLInputElement).value;
      dataParams.accountName = (document.getElementById("accountName") as HTMLInputElement).value;
      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number((document.getElementById("minimumValueAllowed") as HTMLInputElement).value);


      if (!dataParams.accountId) {
        errors.push("請填寫存款帳戶號碼");
      }

      if (!dataParams.accountName) {
        errors.push("請填寫存款帳戶名稱");
      }

      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫帳戶初始金額");
      }

      if (isNaN(dataParams.minimumValueAllowed)) {
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
