<template>
  <template v-if="props.creditCardId">
    <ui-buttonGroup showView :viewText="'檢視信用卡'" @dataView="cashCardDataHandling()" />
  </template>
  <template v-if="!props.creditCardId">
    <ui-buttonGroup showCreate :createText="'新增信用卡'" @dataCreate="cashCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { getCurrentYMD } from "@/composables/tools";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ creditCardId?: string; userId?: string; }>(), { creditCardId: "", userId: "" });
const emits = defineEmits(["dataReseaching"]);


const dataParams = reactive<{
  creditCardId: string;
  userId: string;
  creditCardName: string;
  creditCardBankNo: string;
  creditCardBankName: string;
  creditCardScheme: string;
  creditPerMonth: number;
  createdDate: string;
}>({
  creditCardId: props.creditCardId || "",
  userId: props.userId || "",
  creditCardName: "",
  creditCardBankNo: "",
  creditCardBankName: "",
  creditCardScheme: "",
  creditPerMonth: 0,
  createdDate: getCurrentYMD(),
});


async function cashCardDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.creditCardId ? "修改儲值票卡資料" : "新增儲值票卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        ${props.creditCardId ? `
        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值票卡ID：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditCardId" value="${dataParams.creditCardId}" disabled />
        </div>` : 
        ""}


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">信用卡名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditCardName" value="${dataParams.creditCardName}" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">發卡銀行：</span>
          <input class="col-span-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditCardBankNo" value="${dataParams.creditCardBankNo}" />
          <input class="col-span-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditCardBankName" value="${dataParams.creditCardBankName}" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">信用額度：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditPerMonth" value="${dataParams.creditPerMonth}" type="number" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">發卡機構：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditCardScheme" value="${dataParams.creditCardScheme}" ${props.creditCardId ? "disabled" : ""} />
        </div>


        ${props.creditCardId ? `
        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="createdDate" value="${dataParams.createdDate}" disabled />
        </div>` : 
        ""}


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

      dataParams.creditCardName = (document.getElementById("creditCardName") as HTMLInputElement).value;
      dataParams.creditPerMonth = Number((document.getElementById("creditPerMonth") as HTMLInputElement).value);
      dataParams.creditCardScheme = (document.getElementById("creditCardScheme") as HTMLInputElement).value;


      // 驗證單位代碼與單位名稱
      if (!dataParams.creditCardName) {
        errors.push("請填寫儲值票卡名稱");
      }

      if (isNaN(dataParams.creditPerMonth) || dataParams.creditPerMonth <= 0) {
        errors.push("請填寫信用卡信用額度");
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
