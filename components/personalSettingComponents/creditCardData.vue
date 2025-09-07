<template>
  <template v-if="props.creditCardIdGot">
    <ui-buttonGroup showView :viewText="'檢視信用卡'" @dataView="searchingCreditCardData()" />
    <ui-buttonGroup showRemove :removeText="'刪除信用卡'" @dataRemove="removeCreditcardData()" />
  </template>
  <template v-if="!props.creditCardIdGot">
    <ui-buttonGroup showCreate :createText="'新增信用卡'" @dataCreate="creditCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import {
  fetchCreditCardById,
  fetchCreditCardCreate,
  fetchCreditCardUpdate,
  fetchCreditCardDelete,
} from "@/server/creditCardApi";
import { ICreditCardList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ creditCardIdGot?: string }>(), { creditCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const getDefaultDataParams = (): ICreditCardList => ({
  creditcardId: props.creditCardIdGot || "",
  userId: "",
  accountType: "creditCard",
  creditcardName: "",
  creditcardBankCode: "",
  creditcardBankName: "",
  creditcardSchema: "",
  currency: "",
  creditPerMonth: 0,
  expirationDate: "",
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<ICreditCardList>(getDefaultDataParams());



async function searchingCreditCardData() {
  try {
    const res: IResponse = await fetchCreditCardById(props.creditCardIdGot);
    if (res.data.returnCode === 0) {
      dataParams.creditcardId = res.data.data.creditcardId;
      dataParams.userId = res.data.data.userId;
      dataParams.creditcardName = res.data.data.creditcardName;
      dataParams.creditcardBankCode = res.data.data.creditcardBankCode;
      dataParams.creditcardBankName = res.data.data.creditcardBankName;
      dataParams.creditcardSchema = res.data.data.creditcardSchema;
      dataParams.currency = res.data.data.currency;
      dataParams.creditPerMonth = res.data.data.creditPerMonth;
      dataParams.expirationDate = res.data.data.expirationDate;
      dataParams.alertValue = res.data.data.alertValue;
      dataParams.openAlert = res.data.data.openAlert;
      dataParams.createdDate = res.data.data.createdDate;
      dataParams.note = res.data.data.note;

      await creditCardDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function creditCardDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.creditCardIdGot ? "修改信用卡資料" : "新增信用卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>信用卡名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="creditcardName" value="${dataParams.creditcardName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">發卡銀行代碼：</span>
          <input class="col-span-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="creditcardBankCode" value="${dataParams.creditcardBankCode}" />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">發卡銀行：</span>
          <input class="${tailwindStyles.inputClasses}" id="creditcardBankName" value="${dataParams.creditcardBankName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>發卡機構：</span>
          <div id="creditcardSchemaSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>結算貨幣：</span>
          <div id="currencySelectComponent"></div>
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
          <span class="col-start-1 col-end-3 text-right">提醒：</span>
          <div class="flex justify-start items-center">
            <div id="switchComponent"></div>
          </div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>到期年月：</span>
          <div class="flex justify-start items-center">
            <div class="mx-2" id="yearMonthComponent"></div>
          </div>
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="note" rows="6">${dataParams.note}</textarea>
        </div>


        ${
          props.creditCardIdGot
            ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="${tailwindStyles.inputClasses}" id="createdDate" value="${yearMonthDayTimeFormat(dataParams.createdDate)}" disabled />
        </div>`
            : ""
        }

      </div>
    `,
    confirmButtonText: props.creditCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      let creditCardSchemaSelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/creditCardSchemaSelect.vue")),
        {
          selectId: dataParams.creditcardSchema,
          sellectAll: false,
          isAble: props.creditCardIdGot ? true : false,
          onSendbackSchemaId: (schemaId: string) => {
            dataParams.creditcardSchema = schemaId;
          },
        },
      );
      creditCardSchemaSelect.mount("#creditcardSchemaSelectComponent");

      let currencySelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue")),
        {
          currencyIdGot: dataParams.currency || "",
          isDisable: props.creditCardIdGot ? true : false,
          onSendbackCurrencyId: (currencyId: string) => {
            dataParams.currency = currencyId;
          },
        },
      );
      currencySelect.mount("#currencySelectComponent");

      const creditPerMonth = document.getElementById("creditPerMonth") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      creditPerMonth.addEventListener("change", () => {
        validateAlertValue();
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

      let switchComponent = createApp(
        defineAsyncComponent(() => import("@/components/ui/switch.vue")),
        {
          switchValueGot: dataParams.openAlert,
          onSendBackSwitchValue: (switchValue: boolean) => {
            dataParams.openAlert = switchValue;
          },
        },
      );
      switchComponent.mount("#switchComponent");

      let yearMonthComponent = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/yearMonthSelect.vue")),
        {
          yearMonthGot: dataParams.expirationDate,
          onSendbackYearMonth: (year: number, month: number) => {
            dataParams.expirationDate = `${year}-${month.toString().padStart(2, "0")}-01`;
          },
        },
      );
      yearMonthComponent.mount("#yearMonthComponent");

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.creditcardName = (document.getElementById("creditcardName") as HTMLInputElement).value;
      dataParams.creditcardBankCode = (document.getElementById("creditcardBankCode") as HTMLInputElement).value;
      dataParams.creditcardBankName = (document.getElementById("creditcardBankName") as HTMLInputElement).value;
      dataParams.creditPerMonth = Number((document.getElementById("creditPerMonth") as HTMLInputElement).value);
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.note = (document.getElementById("note") as HTMLTextAreaElement).value;

      if (!dataParams.creditcardName) {
        errors.push("請填寫信用卡名稱");
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
      // console.log("result:", result.value);
      try {
        const res: IResponse = await (props.creditCardIdGot ? fetchCreditCardUpdate : fetchCreditCardCreate)(
          result.value,
        );
        // console.log("RES:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
          Object.assign(dataParams, getDefaultDataParams());
        } else {
          showAxiosErrorMsg({ message: res.data.message });
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
}

async function removeCreditcardData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除信用卡資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCreditCardDelete,
    apiParams: props.creditCardIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
