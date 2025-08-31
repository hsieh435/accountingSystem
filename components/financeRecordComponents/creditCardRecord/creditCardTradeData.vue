<template>
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視信用卡花費'" @dataView="searchingCreditCardRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增信用卡花費'" @dataCreate="creditCardRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, createApp, h } from "vue";
import { fetchCreditCardRecordById, fetchCreditCardRecordCreate, fetchCreditCardRecordUpdate } from "@/server/creditCardRecordApi";
import { ICreditCardRecordList, IResponse } from "@/models/index";
import { getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ tradeIdGot?: string; creditCardIdGot?: string }>(), {
  tradeIdGot: "",
  creditCardIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);



const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));



const getDefaultDataParams = (): ICreditCardRecordList => ({
  tradeId: props.tradeIdGot || "",
  creditCardId: props.creditCardIdGot,
  tradeDatetime: "",
  creditCardUser: "",
  accountType: "",
  tradeCategory: "",
  tradeAmount: 0,
  currency: "",
  billMonth: "",
  tradeDescription: "",
  tradeNote: "",
});
const dataParams = reactive<ICreditCardRecordList>(getDefaultDataParams());



async function searchingCreditCardRecord() {
  // creditCardRecordDataHandling();

  try {
    const res: IResponse = await fetchCreditCardRecordById({
      creditCardId:  props.creditCardIdGot,
      tradeId: props.tradeIdGot
    });
    if (res.data.returnCode === 0) {
      // dataParams.creditcardId = res.data.data.creditcardId;
      // dataParams.userId = res.data.data.userId;
      // dataParams.creditcardName = res.data.data.creditcardName;
      // dataParams.creditcardBankCode = res.data.data.creditcardBankCode;
      // dataParams.creditcardBankName = res.data.data.creditcardBankName;
      // dataParams.creditcardSchema = res.data.data.creditcardSchema;
      // dataParams.currency = res.data.data.currency;
      // dataParams.creditPerMonth = res.data.data.creditPerMonth;
      // dataParams.expirationDate = res.data.data.expirationDate;
      // dataParams.alertValue = res.data.data.alertValue;
      // dataParams.openAlert = res.data.data.openAlert;
      // dataParams.createdDate = res.data.data.createdDate;
      // dataParams.note = res.data.data.note;
      Object.assign(dataParams, getDefaultDataParams());

      await creditCardRecordDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function creditCardRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeIdGot ? "編輯信用卡收支紀錄" : "新增信用卡收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>信用卡：</span>
          <div id="accountSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div id="tradeDatetimeComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
          <div id="tradeCategorySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeAmount" value="${dataParams.tradeAmount}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>貨幣：</span>
          <div id="currencySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">說明：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeDescription" value="${dataParams.tradeDescription}" />
        </div>

        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="tradeNote" rows="6">${dataParams.tradeNote}</textarea>
        </div>

      </div>
    `,
    confirmButtonText: props.tradeIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {

      let creditCardAccountSelect = createApp({
        render() {
          return h(accountSelect, {
            selectTargetId: "isCreditcardAble",
            accountIdGot: dataParams.creditCardId,
            isDisable: props.tradeIdGot ? true : false,
            onSendbackAccountId: (account: string, currency: string) => {
              dataParams.creditCardId = account;
              dataParams.currency = dataParams.creditCardId ? currency : "";
            },
          });
        },
      });
      creditCardAccountSelect.mount("#accountSelectComponent");

      let cashCardTradeDatetime = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")),
        {
          dateTimeGot: dataParams.tradeDatetime,
          onSendbackDateTime: (dateTime: string) => {
            dataParams.tradeDatetime = dateTime;
          },
        },
      );
      cashCardTradeDatetime.mount("#tradeDatetimeComponent");

      let cashCardTradeCategory = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue")),
        {
          accountType: "isCreditcardAble",
          tradeCategoryId: dataParams.tradeCategory,
          onSendbackTradeCategory: (tradeCategoryId: string) => {
            dataParams.tradeCategory = tradeCategoryId;
          },
        },
      );
      cashCardTradeCategory.mount("#tradeCategorySelectComponent");


      let creditCardCurrencySelect = createApp({
        render() {
          return h(currencySelect, {
            currencyIdGot: dataParams.currency,
            isDisable: true,
          });
        },
      });
      creditCardCurrencySelect.mount("#currencySelectComponent");

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      if (!props.tradeIdGot) {
        dataParams.tradeId = getCurrentTimestamp() + "";
      }
      dataParams.tradeAmount = Number((document.getElementById("tradeAmount") as HTMLInputElement).value);
      dataParams.tradeDescription = (document.getElementById("tradeDescription") as HTMLInputElement).value;
      dataParams.tradeNote = (document.getElementById("tradeNote") as HTMLInputElement).value;

      if (!dataParams.tradeDatetime) {
        errors.push("請填寫交易時間");
      }
      if (!dataParams.tradeCategory) {
        errors.push("請選擇收支項目");
      }
      if (dataParams.tradeAmount < 0) {
        errors.push("交易金額不得為負");
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
      // Object.assign(dataParams, getDefaultDataParams());
    }
  });
}
</script>
<style lang="scss" scoped></style>
