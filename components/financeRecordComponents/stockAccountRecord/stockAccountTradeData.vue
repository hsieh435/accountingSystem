<template>
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視證券帳戶收支'" @dataView="searchingStockAccountRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增證券帳戶收支'" @dataCreate="stockAccountRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, createApp, h } from "vue";
import { fetchStockAccountRecordById, fetchStockAccountRecordCreate, fetchStockAccountRecordUpdate } from "@/server/stockAccountRecordApi";
import { IStockAccountRecordList, IStockList, IResponse} from "@/models/index";
import { currencyFormat, getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ tradeIdGot?: string; accountIdGot?: string }>(), {
  tradeIdGot: "",
  accountIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);



const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));
const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));



const getDefaultDataParams = (): IStockAccountRecordList => ({
  tradeId: props.tradeIdGot || "",
  accountId: props.accountIdGot,
  tradeDatetime: "",
  accountUser: "",
  transactionType: "",
  tradeCategory: "",
  stockNo: "",
  stockName: "",
  pricePerShare: 0,
  quantity: 0,
  handlingFee: 0,
  transactionTax: 0,
  tradePrice: 0,
  totalPrice: 0,
  currency: "",
  tradeDescription: "",
  tradeNote: "",
});
const dataParams = reactive<IStockAccountRecordList>(getDefaultDataParams());



async function searchingStockAccountRecord() {

  try {
    const res: IResponse = await fetchStockAccountRecordById({
      accountId:  props.accountIdGot,
      tradeId: props.tradeIdGot
    });
    console.log(res);
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      await stockAccountRecordDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function stockAccountRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);
  Swal.fire({
    title: props.tradeIdGot ? "編輯證券帳戶收支紀錄" : "新增證券帳戶收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>證券帳戶：</span>
          <div id="accountSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div id="tradeDatetimeComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>買 / 賣：</span>
          <div class="col-span-4" id="transactionTypeSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>股票：</span>
          <div class="col-span-3" id="stockSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易項目：</span>
          <div class="col-span-4" id="tradeCategorySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>每股價格：</span>
          <input class="${tailwindStyles.inputClasses}" id="pricePerShare" value="${dataParams.pricePerShare}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>購買股數：</span>
          <input class="${tailwindStyles.inputClasses}" id="quantity" value="${dataParams.quantity}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>手續費：</span>
          <input class="${tailwindStyles.inputClasses}" id="handlingFee" value="${dataParams.handlingFee}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易稅：</span>
          <input class="${tailwindStyles.inputClasses}" id="transactionTax" value="${dataParams.transactionTax}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>總價：</span>
          <input class="${tailwindStyles.inputClasses}" id="totalPrice" value="${currencyFormat(dataParams.totalPrice)}" disabled />
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
    // background: "#e1e1e11a",
    didOpen: () => {
      let stockAccountSelect = createApp({
        render() {
          return h(accountSelect, {
            selectTargetId: "isStaccountAble",
            accountIdGot: dataParams.accountId,
            isDisable: props.tradeIdGot ? true : false,
            onSendbackAccountId: (account: string, currency: string) => {
              dataParams.accountId = account;
              dataParams.currency = account ? currency : "";
            },
          });
        },
      });
      stockAccountSelect.mount("#accountSelectComponent");

      let stockAccountTradeDatetime = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")),
        {
          dateTimeGot: dataParams.tradeDatetime,
          onSendbackDateTime: (dateTime: string) => {
            dataParams.tradeDatetime = dateTime;
          },
        },
      );
      stockAccountTradeDatetime.mount("#tradeDatetimeComponent");


      let stockAccountTransactionType = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue")),
        {
          transactionType: dataParams.transactionType,
          onSendbackTransactionType: (type: string) => {
            dataParams.transactionType = type;
          },
        },
      );
      stockAccountTransactionType.mount("#transactionTypeSelectComponent");


      let stockSelect = createApp({
        render() {
          return h(stockListSelect, {
            stockNoGot: dataParams.stockNo,
            onSendbackStockNo: (stockItem: IStockList) => {
              dataParams.stockNo = stockItem.stock_id;
              dataParams.stockName = stockItem.stock_name;
              console.log("dataParams:", dataParams);
            },
          });
        },
      });
      stockSelect.mount("#stockSelectComponent");


      let stockAccountCategory = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue")),
        {
          accountType: "isStaccountAble",
          tradeCategoryGot: dataParams.tradeCategory,
          onSendbackTradeCategory: (tradeCategoryId: string) => {
            dataParams.tradeCategory = tradeCategoryId;
          },
        },
      );
      stockAccountCategory.mount("#tradeCategorySelectComponent");


      const pricePerShare = document.getElementById("pricePerShare") as HTMLInputElement;
      const quantity = document.getElementById("quantity") as HTMLInputElement;
      const handlingFee = document.getElementById("handlingFee") as HTMLInputElement;
      const transactionTax = document.getElementById("transactionTax") as HTMLInputElement;
      const totalPriceInput = document.getElementById("totalPrice") as HTMLInputElement;
      const calculateAmount = () => {
        const total =
          Number(pricePerShare.value) * Number(quantity.value) +
          (Number(handlingFee.value) + Number(transactionTax.value));
        totalPriceInput.value = total.toString();
        dataParams.totalPrice = total;
      };

      pricePerShare.addEventListener("input", calculateAmount);
      quantity.addEventListener("input", calculateAmount);
      handlingFee.addEventListener("input", calculateAmount);
      transactionTax.addEventListener("input", calculateAmount);


      let stockAccountCurrencySelect = createApp({
        render() {
          return h(currencySelect, {
            currencyIdGot: dataParams.currency,
            isDisable: true,
          });
        },
      });
      stockAccountCurrencySelect.mount("#currencySelectComponent");


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

      dataParams.stockNo = (document.getElementById("stockNo") as HTMLInputElement).value;
      dataParams.stockName = (document.getElementById("stockName") as HTMLInputElement).value;
      dataParams.pricePerShare = Number((document.getElementById("pricePerShare") as HTMLInputElement).value);
      dataParams.quantity = Number((document.getElementById("quantity") as HTMLInputElement).value);
      dataParams.handlingFee = Number((document.getElementById("handlingFee") as HTMLInputElement).value);
      dataParams.transactionTax = Number((document.getElementById("transactionTax") as HTMLInputElement).value);
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
        errors.push("請選擇交易項目");
      }
      if (dataParams.pricePerShare < 0) {
        errors.push("每股金額不得為負");
      }
      if (dataParams.quantity < 0) {
        errors.push("購買股數不得為負");
      }
      if (dataParams.handlingFee < 0) {
        errors.push("手續費不得為負");
      }
      if (dataParams.transactionTax < 0) {
        errors.push("交易稅不得為負");
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
      // showAxiosToast({ message: res.data.message });
      // emits("dataReseaching");
      Object.assign(dataParams, getDefaultDataParams());
    }
  });
}
</script>
<style lang="scss" scoped></style>
