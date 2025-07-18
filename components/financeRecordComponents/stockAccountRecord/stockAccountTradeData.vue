<template>  
  <template v-if="props.tradeIdGot">
    <ui-buttonGroup showView :viewText="'檢視證券帳戶收支'" @dataView="searchingStockAccountRecord()" />
  </template>
  <template v-if="!props.tradeIdGot">
    <ui-buttonGroup showCreate :createText="'新增證券帳戶收支'" @dataCreate="stockAccountRecordDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, createApp } from "vue";
import { IStockAccountRecordList } from "@/models/index";
import { currencyFormat, getCurrentTimestamp } from "@/composables/tools";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ tradeIdGot?: string; bankIdGot?: string }>(), { tradeIdGot: "", bankIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<IStockAccountRecordList>({
  tradeId: props.tradeIdGot || "",
  accountId: props.bankIdGot,  
  tradeDatetime: "",
  accountUser: "",
  incomingOutgoing: "",
  tradeCategory: "",
  stockNo: "",
  stockName: "",
  pricePerShare: 0,
  quantity: 0,
  handlingFee: 0,
  transactionTax: 0,
  totalPrice: 0,
  tradeDescription: "",
  tradeNote: "",
});



async function searchingStockAccountRecord() {
  // stockAccountRecordDataHandling();  
}


async function stockAccountRecordDataHandling(apiMsg?: string) {
  // console.log(dataParams);
  Swal.fire({
    title: props.tradeIdGot ? "編輯證券帳戶收支紀錄" : "新增證券帳戶收支紀錄",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


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
          <div class="col-span-4" id="incomeOutgoSelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易項目：</span>
          <div class="col-span-4" id="stockAccountTradeCategorySelectComponent"></div>
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>股票代號：</span>
          <input class="${tailwindStyles.inputClasses}" id="stockNo" value="${dataParams.stockNo}" />
        </div>
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>股票名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="stockName" value="${dataParams.stockName}" />
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
          <span class="col-start-1 col-end-3 text-right">說明：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeDescription" value="${dataParams.tradeDescription}" />
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">備註：</span>
          <textarea class="${tailwindStyles.inputClasses}" id="tradeNote" rows="4" maxlength="500">${dataParams.tradeNote}</textarea>
        </div>

      </div>
    `,
    confirmButtonText: props.tradeIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
    background: "#fff",
    allowOutsideClick: false,
    didOpen: () => {


      let stockAccountSelect = createApp(defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue")), {
        selectId: "stockAccount",
        selectTitle: "證券帳戶",
        onSendbackAccountId: (accountId: string) => {
          dataParams.accountId = accountId;
          // console.log("選擇的票卡ID:", accountId);
        },
      });
      stockAccountSelect.mount("#accountSelectComponent");

    
      let currencyAccountTradeDatetime = createApp(defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue")), {
        dateTimeGot: dataParams.tradeDatetime,
        onSendbackDateTime: (dateTime: string) => {
          dataParams.tradeDatetime = dateTime;
        },
      });
      currencyAccountTradeDatetime.mount("#tradeDatetimeComponent");


      let currencyAccountIncomeOutgo = createApp(defineAsyncComponent(() => import("@/components/ui/select/incomeOutgoSelect.vue")), {
        tradeCategoryGot: dataParams.incomingOutgoing,
        onSendbackIncomeExpense: (type: string) => {
          dataParams.incomingOutgoing = type;
        },
      });
      currencyAccountIncomeOutgo.mount("#incomeOutgoSelectComponent");


      let currencyAccountCategory = createApp(defineAsyncComponent(() => import("@/components/ui/select/stockAccountTradeCategorySelect.vue")), {
        tradeCategoryGot: dataParams.tradeCategory,
        onSendbackTradeCategory: (tradeCategoryId: string) => {
          dataParams.tradeCategory = tradeCategoryId;
        },
      });
      currencyAccountCategory.mount("#stockAccountTradeCategorySelectComponent");

      
      const pricePerShare = document.getElementById("pricePerShare") as HTMLInputElement;
      const quantity = document.getElementById("quantity") as HTMLInputElement;
      const handlingFee = document.getElementById("handlingFee") as HTMLInputElement;
      const transactionTax = document.getElementById("transactionTax") as HTMLInputElement;
      const totalPriceInput = document.getElementById("totalPrice") as HTMLInputElement;
      const calculateDateDiff = () => {
        const total = (Number(pricePerShare.value) * Number(quantity.value)) + (Number(handlingFee.value) + Number(transactionTax.value));
        totalPriceInput.value = total.toString();
        dataParams.totalPrice = total;
      };
      
      pricePerShare.addEventListener("input", calculateDateDiff);
      quantity.addEventListener("input", calculateDateDiff);
      handlingFee.addEventListener("input", calculateDateDiff);
      transactionTax.addEventListener("input", calculateDateDiff);

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
      if (!dataParams.incomingOutgoing) {
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

    }
  });
};


</script>
<style lang="scss" scoped></style>
