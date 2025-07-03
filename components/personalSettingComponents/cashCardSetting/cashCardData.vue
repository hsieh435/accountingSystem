<template>
  <template v-if="props.cashCardId">
    <ui-buttonGroup showView :viewText="'檢視儲值票卡'" @dataView="cashCardDataHandling()" />
  </template>
  <template v-if="!props.cashCardId">
    <ui-buttonGroup showCreate :createText="'新增儲值票卡'" @dataCreate="cashCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { getCurrentYMD, getCurrentTimestamp } from "@/composables/tools";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ cashCardId?: string; userId?: string; }>(), { cashCardId: "", userId: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<{
  cashCardId: string;
  userId: string;
  cashCardName: string;
  startingAmount: number;
  currentAmount: number;
  minimumValueAllow: number;
  maximumValueAllow: number;
  createdDate: string;
}>({
  cashCardId: props.cashCardId || "",
  userId: props.userId || "",
  cashCardName: "",
  startingAmount: 0,
  currentAmount: 0,
  minimumValueAllow: 0,
  maximumValueAllow: 0,
  createdDate: getCurrentYMD(),
});


async function cashCardDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.cashCardId ? "修改儲值票卡資料" : "新增儲值票卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        ${props.cashCardId ? `
        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值票卡ID：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="cashCardId" value="${dataParams.cashCardId}" disabled />
        </div>` : 
        ""}


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值票卡名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="cashCardName" value="${dataParams.cashCardName}" />
        </div>


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">初始金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.cashCardId ? "disabled" : ""} />
        </div>


        ${props.cashCardId ? `
        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="currentAmount" value="${dataParams.currentAmount}" type="number" />
        </div>` : 
        ""}


        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值最小值：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="minimumValueAllow" value="${dataParams.minimumValueAllow}" type="number" />
        </div>

        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值最大值：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="maximumValueAllow" value="${dataParams.maximumValueAllow}" type="number" />
        </div>


        ${props.cashCardId ? `
        <div class="d-flex flex-row justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="createdDate" value="${dataParams.createdDate}" type="text" disabled />
        </div>` : 
        ""}


      </div>
    `,
    confirmButtonText: props.cashCardId ? "修改" : "新增",
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

      if (!props.cashCardId) {
        dataParams.cashCardId = getCurrentTimestamp() + "";
      }

      dataParams.cashCardName = (document.getElementById("cashCardName") as HTMLInputElement).value;
      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.currentAmount =
        props.cashCardId ?
        Number((document.getElementById("currentAmount") as HTMLInputElement).value) :
        Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllow = Number((document.getElementById("minimumValueAllow") as HTMLInputElement).value);
      dataParams.maximumValueAllow = Number((document.getElementById("maximumValueAllow") as HTMLInputElement).value);
      // dataParams.createdDate = props.cashCardId ? getCurrentYMD(): (document.getElementById("createdDate") as HTMLInputElement).value;

      // 驗證單位代碼與單位名稱
      if (!dataParams.cashCardName) {
        errors.push("請填寫儲值票卡名稱");
      }

      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫儲值票卡初始金額");
      }

      if (isNaN(dataParams.minimumValueAllow)) {
        errors.push("請填寫儲值票卡最小儲值金額");
      }

      if (isNaN(dataParams.maximumValueAllow)) {
        errors.push("請填寫儲值票卡最大儲值金額");
      }

      if (dataParams.maximumValueAllow <= dataParams.minimumValueAllow) {
        errors.push("儲值票卡最小儲值金額必須小於最大儲值金額");
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
