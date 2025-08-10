<template>
  <template v-if="props.creditCardIdGot">
    <ui-buttonGroup showView :viewText="'檢視信用卡'" @dataView="searchingCreditCardData()" />
  </template>
  <template v-if="!props.creditCardIdGot">
    <ui-buttonGroup showCreate :createText="'新增信用卡'" @dataCreate="creditCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import { ICreditCardList } from "@/models/index";
import { getCurrentYMD, getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ creditCardIdGot?: string; userIdGot?: string; }>(), { creditCardIdGot: "", userIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ICreditCardList>({
  creditcardId: props.creditCardIdGot || "",
  creditcardUser: "",
  creditcardName: "",
  creditcardBankCode: "",
  creditcardBankName: "",
  creditcardSchema: "",
  currency: "TWD",
  creditPerMonth: 0,
  expirationDate: "",
  alertValue: 0,
  openAlert: false,
  createdDate: getCurrentYMD(),
});


async function searchingCreditCardData() {
  // 在這裡可以加入 API 呼叫來獲取信用卡資料
  creditCardDataHandling();
}



async function creditCardDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.creditCardIdGot ? "修改信用卡資料" : "新增信用卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>信用卡名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="creditcardName" value="${dataParams.creditcardName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>發卡銀行代碼：</span>
          <input class="col-span-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditcardBankCode" value="${dataParams.creditcardBankCode}" ${props.creditCardIdGot ? "disabled" : ""} />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>發卡銀行：</span>
          <input class="${tailwindStyles.inputClasses}" id="creditcardBankName" value="${dataParams.creditcardBankName}" ${props.creditCardIdGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>發卡機構：</span>
          <div id="creditcardSchemaSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>信用額度：</span>
          <input class="${tailwindStyles.inputClasses}" id="creditPerMonth" value="${dataParams.creditPerMonth}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 mt-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>
        <div class="flex justify-start items-center grid grid-cols-6 mb-2">
          <span class="col-start-1 col-end-3 text-right"></span>
          <span class="col-start-3 col-end-6 text-left text-red-600">（ 每月消費額度累積提醒 ）</span>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">提醒：</span><div class="mx-2" id="switchComponent"></div>
        </div>


        ${props.creditCardIdGot ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="${tailwindStyles.inputClasses}" id="createdDate" value="${dataParams.createdDate}" disabled />
        </div>` :
        ""}

      </div>
    `,
    confirmButtonText: props.creditCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {

      let creditCardSchemaSelect = createApp(defineAsyncComponent(() => import("@/components/ui/select/creditCardSchemaSelect.vue")), {
        selectId: "cashCard",
        sellectAll: false,
        isAble: props.creditCardIdGot ? true : false,
        onSendbackSchemaId: (schemaId: string) => {
          dataParams.creditcardSchema = schemaId;
        },
      });
      creditCardSchemaSelect.mount("#creditcardSchemaSelectComponent");

      const creditPerMonth = document.getElementById("creditPerMonth") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      creditPerMonth.addEventListener("change", () => {
        validateAlertValue()
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        alertValue.max = creditPerMonth.value;
        if (Number(alertValue.value) > Number(creditPerMonth.value)) {
          alertValue.value = creditPerMonth.value;
        }
      }


      let switchComponent = createApp(defineAsyncComponent(() => import("@/components/ui/switch.vue")), {
        switchValueGot: dataParams.openAlert,
        onSendBackSwitchValue: (switchValue: boolean) => {
          dataParams.openAlert = switchValue;
        },
      });
      switchComponent.mount("#switchComponent");


      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.creditcardName = (document.getElementById("creditcardName") as HTMLInputElement).value;
      dataParams.creditPerMonth = Number((document.getElementById("creditPerMonth") as HTMLInputElement).value);
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.openAlert = Boolean((document.getElementById("openAlert") as HTMLInputElement).checked);


      if (!dataParams.creditcardName) {
        errors.push("請填寫信用卡名稱");
      }
      if (!dataParams.creditcardBankCode) {
        errors.push("請填寫發卡銀行代碼");
      }
      if (!dataParams.creditcardBankName) {
        errors.push("請填寫發卡銀行名稱");
      }
      if (!dataParams.creditcardSchema) {
        errors.push("請選擇發卡機構");
      }
      if (isNaN(dataParams.creditPerMonth) || dataParams.creditPerMonth <= 0) {
        errors.push("請填寫信用卡信用額度");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (dataParams.alertValue > dataParams.creditPerMonth) {
        errors.push("提醒金額不得大於信用額度");
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
