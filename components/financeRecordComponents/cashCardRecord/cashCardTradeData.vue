<template>
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視儲值票卡收支'" @dataView="searchingCashCardRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增儲值票卡收支'" @dataCreate="cashCardRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, createApp, h } from "vue";
import { ICashCardRecordList } from "@/models/index";
import { getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ tradeIdGot?: string; cashCardIdGot?: string }>(), {
  tradeIdGot: "",
  cashCardIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);



const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));



const dataParams = reactive<ICashCardRecordList>({
  tradeId: props.tradeIdGot || "",
  cashcardId: props.cashCardIdGot || "",
  cashcardName: "",
  accountType: "",
  tradeDatetime: "",
  transactionType: "",
  tradeCategory: "",
  tradeAmount: 0,
  currency: "",
  tradeDescription: "",
  tradeNote: "",
});

async function searchingCashCardRecord() {
  // cashCardRecordDataHandling();
}

async function cashCardRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeIdGot ? "編輯儲值票卡收支紀錄" : "新增儲值票卡收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>儲值票卡：</span>
          <div id="accountSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div id="tradeDatetimeComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>收支：</span>
          <div class="col-span-4" id="transactionTypeSelectComponent"></div>
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
    confirmButtonText: props.cashCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {

      let cashCardAccountSelect = createApp({
        render() {
          return h(accountSelect, {
            selectTargetId: "isCashcardAble",
            accountIdGot: dataParams.cashcardId,
            isDisable: props.tradeIdGot ? true : false,
            sendbackAccountId: (account: string, currency: string) => {
              dataParams.cashcardId = account;
              dataParams.currency = currency;
            },
          });
        },
      });
      cashCardAccountSelect.mount("#accountSelectComponent");

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

      let cashCardTransactionType = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue")),
        {
          tradeCategoryGot: dataParams.transactionType,
          onSendbackIncomeExpense: (type: string) => {
            dataParams.transactionType = type;
          },
        },
      );
      cashCardTransactionType.mount("#transactionTypeSelectComponent");

      let cashCardTradeCategory = createApp({
        render() {
          return h(currencySelect, {
            currencyIdGot: dataParams.currency,
            isDisable: true,
          });
        },
      });
      cashCardTradeCategory.mount("#tradeCategorySelectComponent");



      let cashCardCurrencySelect = createApp({
        render() {
          return h(currencySelect, {
            currencyIdGot: dataParams.currency,
            isDisable: true,
          });
        },
      });
      cashCardCurrencySelect.mount("#currencySelectComponent");

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

      if (!dataParams.cashcardId) {
        errors.push("請選擇儲值票卡");
      }
      if (!dataParams.tradeDatetime) {
        errors.push("請填寫交易時間");
      }
      if (!dataParams.transactionType) {
        errors.push("請選擇收支");
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
    }
  });
}
</script>
<style lang="scss" scoped></style>
