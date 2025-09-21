<template>
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視銀行帳戶收支'" @dataView="searchingCurrencyAccountRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增銀行帳戶收支'" @dataCreate="currencyAccountRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, createApp, h } from "vue";
import {
  fetchCurrencyAccountRecordById,
  fetchCurrencyAccountRecordCreate,
  fetchCurrencyAccountRecordUpdate,
} from "@/server/currencyAccountRecordApi";
import { IcurrencyAccountRecordList, IResponse } from "@/models/index";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ tradeIdGot?: string; accountIdGot?: string }>(), {
  tradeIdGot: "",
  accountIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));

const getDefaultDataParams = (): IcurrencyAccountRecordList => ({
  tradeId: props.tradeIdGot || "",
  accountId: props.accountIdGot,
  tradeDatetime: "",
  accountUser: "",
  accountType: "",
  transactionType: "",
  tradeCategory: "",
  tradeAmount: 0,
  currency: "",
  tradeDescription: "",
  tradeNote: "",
});
const dataParams = reactive<IcurrencyAccountRecordList>(getDefaultDataParams());

async function searchingCurrencyAccountRecord() {
  try {
    const res: IResponse = await fetchCurrencyAccountRecordById({
      accountId: props.accountIdGot,
      tradeId: props.tradeIdGot,
    });
    console.log(res.data.data);
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      await currencyAccountRecordDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function currencyAccountRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeIdGot ? "編輯存款帳戶收支紀錄" : "新增存款帳戶收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>存款帳戶：</span>
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
          <input class="${tailwindStyles.getInputClasses()}" id="tradeAmount" value="${dataParams.tradeAmount}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>貨幣：</span>
          <div id="dataBaseCurrencySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">說明：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="tradeDescription" value="${dataParams.tradeDescription}" />
        </div>

        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.getInputClasses()}" id="tradeNote" rows="6">${dataParams.tradeNote}</textarea>
        </div>

      </div>
    `,
    confirmButtonText: props.tradeIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      let currencyAccountSelect = createApp({
        render() {
          return h(accountSelect, {
            selectTargetId: "isCuaccountAble",
            accountIdGot: dataParams.accountId,
            isDisable: props.tradeIdGot ? true : false,
            onSendbackAccountId: (account: string, currency: string) => {
              dataParams.accountId = account;
              dataParams.currency = account ? currency : "";
            },
          });
        },
      });
      currencyAccountSelect.mount("#accountSelectComponent");

      let currencyAccountTradeDatetime = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")),
        {
          dateTimeGot: dataParams.tradeDatetime,
          onSendbackDateTime: (dateTime: string) => {
            dataParams.tradeDatetime = dateTime;
          },
        },
      );
      currencyAccountTradeDatetime.mount("#tradeDatetimeComponent");

      let currencyAccountTransactionTypeSelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue")),
        {
          transactionType: dataParams.transactionType,
          onSendbackTransactionType: (type: string) => {
            dataParams.transactionType = type;
          },
        },
      );
      currencyAccountTransactionTypeSelect.mount("#transactionTypeSelectComponent");

      let currencyAccountCategory = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue")),
        {
          accountType: "isCuaccountAble",
          tradeCategoryGot: dataParams.tradeCategory,
          onSendbackTradeCategory: (tradeCategoryId: string) => {
            dataParams.tradeCategory = tradeCategoryId;
          },
        },
      );
      currencyAccountCategory.mount("#tradeCategorySelectComponent");

      let currencyAccountdataBaseCurrencySelect = createApp({
        render() {
          return h(dataBaseCurrencySelect, {
            currencyIdGot: dataParams.currency,
            isDisable: true,
          });
        },
      });
      currencyAccountdataBaseCurrencySelect.mount("#dataBaseCurrencySelectComponent");

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

      if (!dataParams.accountId) {
        errors.push("請選擇存款帳戶");
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
        const res: IResponse = await (
          props.tradeIdGot ? fetchCurrencyAccountRecordUpdate : fetchCurrencyAccountRecordCreate
        )(result.value);
        console.log("RES:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
        } else {
          showAxiosErrorMsg({ message: res.data.message });
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
    // Object.assign(dataParams, getDefaultDataParams());
  });
}
</script>
<style lang="scss" scoped></style>
