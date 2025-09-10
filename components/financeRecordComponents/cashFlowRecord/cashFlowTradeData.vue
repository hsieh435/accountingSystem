<template>
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視現金收支'" @dataView="searchingCashFlowRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增現金收支'" @dataCreate="cashFlowRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent, h } from "vue";
import {
  fetchCashFlowRecordByTradeId,
  fetchCashFlowRecordCreate,
  fetchCashFlowRecordUpdate,
} from "@/server/cashFlowRecordApi";
import { ICashFlowRecordList, IResponse } from "@/models/index";
import tailwindStyles from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ cashflowIdGot?: string; tradeIdGot?: string }>(), {
  cashflowIdGot: "",
  tradeIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));

const getDefaultDataParams = (): ICashFlowRecordList => ({
  tradeId: props.tradeIdGot || "",
  cashflowId: "",
  userId: "",
  tradeDatetime: "",
  accountType: "cashFlow",
  transactionType: "",
  tradeCategory: "",
  tradeAmount: 0,
  currency: "",
  tradeDescription: "",
  tradeNote: "",
});
const dataParams = reactive<ICashFlowRecordList>(getDefaultDataParams());

async function searchingCashFlowRecord() {
  // console.log("props:", props);
  try {
    const res: IResponse = await fetchCashFlowRecordByTradeId({
      cashflowId: props.cashflowIdGot,
      tradeId: props.tradeIdGot,
    });
    console.log("fetchCashFlowRecordByTradeId:", res.data.data);
    if (res.data.returnCode === 0) {
      // dataParams.tradeId = res.data.data.tradeId;
      // dataParams.cashflowId = res.data.data.cashflowId;
      // dataParams.userId = res.data.data.userId;
      // dataParams.tradeDatetime = res.data.data.tradeDatetime;
      // dataParams.transactionType = res.data.data.transactionType;
      // dataParams.tradeCategory = res.data.data.tradeCategory;
      // dataParams.tradeAmount = res.data.data.tradeAmount;
      // dataParams.currency = res.data.data.currency;
      // dataParams.tradeDescription = res.data.data.tradeDescription;
      // dataParams.tradeNote = res.data.data.tradeNote;
      Object.assign(dataParams, res.data.data);
      await cashFlowRecordDataHandling();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function cashFlowRecordDataHandling(apiMsg?: string) {
  // console.log("props:", props);
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeIdGot ? "編輯現金收支紀錄" : "新增現金收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div class="col-span-4" id="tradeDatetimeComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>現金流：</span>
          <div class="col-span-4" id="accountComponent"></div>
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
          <div id="dataBaseCurrencySelectComponent"></div>
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
      let cashFlowTradeAccount = createApp({
        render() {
          return h(accountSelect, {
            selectTargetId: "isCashflowAble",
            accountIdGot: dataParams.cashflowId,
            isDisable: props.tradeIdGot ? true : false,
            onSendbackAccountId: (account: string, currency: string) => {
              dataParams.cashflowId = account;
              dataParams.currency = dataParams.cashflowId ? currency : "";
            },
          });
        },
      });
      cashFlowTradeAccount.mount("#accountComponent");

      let cashFlowTradeDatetime = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")),
        {
          dateTimeGot: dataParams.tradeDatetime,
          onSendbackDateTime: (dateTime: string) => {
            dataParams.tradeDatetime = dateTime;
          },
        },
      );
      cashFlowTradeDatetime.mount("#tradeDatetimeComponent");

      let cashFlowTransactionType = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue")),
        {
          transactionType: dataParams.transactionType,
          onSendbackTransactionType: (type: string) => {
            dataParams.transactionType = type;
          },
        },
      );
      cashFlowTransactionType.mount("#transactionTypeSelectComponent");

      let cashFlowTradeCategory = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue")),
        {
          accountType: "isCashflowAble",
          tradeCategoryGot: dataParams.tradeCategory,
          onSendbackTradeCategory: (tradeCategoryId: string) => {
            dataParams.tradeCategory = tradeCategoryId;
          },
        },
      );
      cashFlowTradeCategory.mount("#tradeCategorySelectComponent");

      let cashFlowdataBaseCurrencySelect = createApp({
        render() {
          return h(dataBaseCurrencySelect, {
            currencyIdGot: dataParams.currency,
            isDisable: true,
          });
        },
      });
      cashFlowdataBaseCurrencySelect.mount("#dataBaseCurrencySelectComponent");

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.tradeAmount = Number((document.getElementById("tradeAmount") as HTMLInputElement).value);
      dataParams.tradeDescription = (document.getElementById("tradeDescription") as HTMLInputElement).value;
      dataParams.tradeNote = (document.getElementById("tradeNote") as HTMLInputElement).value;

      if (!dataParams.cashflowId) {
        errors.push("請選擇現金流帳戶");
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
      // console.log("result:", result.value);
      try {
        const res: IResponse = await (props.tradeIdGot ? fetchCashFlowRecordUpdate : fetchCashFlowRecordCreate)(
          result.value,
        );
        console.log("RES:", res);
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
</script>
<style lang="scss" scoped></style>
