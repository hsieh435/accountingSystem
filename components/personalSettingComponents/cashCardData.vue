<template>
  <template v-if="props.cashCardIdGot">
    <ui-buttonGroup showView :viewText="'檢視儲值票卡'" @dataView="searchingCashCardData()" />
  </template>
  <template v-if="!props.cashCardIdGot">
    <ui-buttonGroup showCreate :createText="'新增儲值票卡'" @dataCreate="cashCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { ICashCardList } from "@/models/index";
import { getCurrentYMD, getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ cashCardIdGot?: string; userIdGot?: string; }>(), { cashCardIdGot: "", userIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ICashCardList>({
  cashCardId: props.cashCardIdGot || "",
  cashCardUser: "",
  cashCardName: "",
  currency: "TWD",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  maximumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  createdDate: getCurrentYMD(),
});



async function searchingCashCardData() {

  // cashCardDataHandling();
}



async function cashCardDataHandling(apiMsg?: string) {
  console.log(dataParams);

  Swal.fire({
    title: props.cashCardIdGot ? "修改儲值票卡資料" : "新增儲值票卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        ${props.cashCardIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">儲值票卡ID：</span>
          <input class="${tailwindStyles.inputClasses}" id="cashCardId" value="${dataParams.cashCardId}" disabled />
        </div>` : 
        ""}


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>儲值票卡名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="cashCardName" value="${dataParams.cashCardName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.cashCardIdGot ? "disabled" : ""} />
        </div>


        ${props.cashCardIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="presentAmount" value="${dataParams.presentAmount}" type="number" />
        </div>` : 
        ""}


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最小儲值金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最大儲值金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="maximumValueAllowed" value="${dataParams.maximumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-center items-center w-full my-2">
          <input class="border border-gray-300 mx-1" id="openAlert" value="${dataParams.openAlert}" type="checkbox" />
          <label class="mx-1" for="openAlert">開啟提醒</label>
        </div>


        ${props.cashCardIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="${tailwindStyles.inputClasses}" id="createdDate" value="${dataParams.createdDate}" type="text" disabled />
        </div>` : 
        ""}

      </div>
    `,
    confirmButtonText: props.cashCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
    background: "#fff",
    allowOutsideClick: false,
    didOpen: () => {
      const startingAmount = document.getElementById("startingAmount") as HTMLInputElement;
      const minimumValueAllowed = document.getElementById("minimumValueAllowed") as HTMLInputElement;
      const maximumValueAllowed = document.getElementById("maximumValueAllowed") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      minimumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      maximumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        // console.log("minimumValueAllowed:", minimumValueAllowed.value);
        // console.log("maximumValueAllowed:", maximumValueAllowed.value);
        // console.log("alertValue:", alertValue.value);

        maximumValueAllowed.min = minimumValueAllowed.value;
        minimumValueAllowed.max = maximumValueAllowed.value;
        // startingAmount.max = maximumValueAllowed.value;
        // startingAmount.min = minimumValueAllowed.value;
        alertValue.max = maximumValueAllowed.value;
        alertValue.min = minimumValueAllowed.value;
      }

      const openAlertCheckbox = document.getElementById("openAlert") as HTMLInputElement;
      openAlertCheckbox.checked = dataParams.openAlert;


      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      if (!props.cashCardIdGot) {
        dataParams.cashCardId = getCurrentTimestamp() + "";
      }

      dataParams.cashCardName = (document.getElementById("cashCardName") as HTMLInputElement).value;
      dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.presentAmount =
        props.cashCardIdGot ?
        Number((document.getElementById("presentAmount") as HTMLInputElement).value) :
        Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number((document.getElementById("minimumValueAllowed") as HTMLInputElement).value);
      dataParams.maximumValueAllowed = Number((document.getElementById("maximumValueAllowed") as HTMLInputElement).value);
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.openAlert = Boolean((document.getElementById("openAlert") as HTMLInputElement).checked);


      if (!dataParams.cashCardName) {
        errors.push("請填寫儲值票卡名稱");
      }
      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫儲值票卡初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed)) {
        errors.push("請填寫儲值票卡最小儲值金額");
      }
      if (isNaN(dataParams.maximumValueAllowed)) {
        errors.push("請填寫儲值票卡最大儲值金額");
      }
      if (dataParams.maximumValueAllowed <= dataParams.minimumValueAllowed) {
        errors.push("儲值票卡最小儲值金額必須小於最大儲值金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (dataParams.alertValue < dataParams.minimumValueAllowed || dataParams.alertValue > dataParams.maximumValueAllowed) {
        errors.push("提醒金額需介於最小儲值金額與最大儲值金額之間");
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
