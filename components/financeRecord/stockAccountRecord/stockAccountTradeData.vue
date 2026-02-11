<template>
  <UModal
    title="證券帳戶收支紀錄"
    description="資料內容"
    v-model:open="openTradeData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視證券帳戶收支'" />
      <ui-buttonGroup :showRemove="props.isEditable" :removeText="'刪除證券帳戶收支'" @dataRemove="deleteTradeRecord" />
    </template>
    <template v-if="!props.tradeIdGot">
      <ui-buttonGroup showCreate :createText="'新增證券帳戶收支'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>證券帳戶：</span>
            <div :class="['w-fit', dataValidate.accountId ? '' : 'outline-1 outline-red-500']">
              <accountSelect
                selectTargetId="isStaccountAble"
                :accountIdGot="dataParams.updateData.accountId"
                :sellectAll="false"
                :isDisable="props.tradeIdGot ? true : props.isEditable"
                @sendbackAccount="settingAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.accountId">
            <span class="col-start-3 col-span-4 text-red-500">請選擇證券帳戶</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
            <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
              <dateTimeSelect
                :dateTimeGot="dataParams.updateData.tradeDatetime"
                @sendbackDateTime="settingTradeDatetime" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeDatetime">
            <span class="col-start-3 col-span-4 text-red-500">請填寫交易時間</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>買 / 賣：</span>
            <div :class="['col-span-2', dataValidate.transactionType ? '' : 'outline-1 outline-red-500']">
              <transactionTypeSelect
                :transactionType="dataParams.updateData.transactionType"
                @sendbackTransactionType="settingTransactionType" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.transactionType">
            <span class="col-span-4 col-end-7 text-red-500">請選擇買 / 賣</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isStaccountAble"
                :tradeCategoryGot="dataParams.updateData.tradeCategory"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeCategory">
            <span class="col-start-3 col-span-4 text-red-500">請選擇交易項目</span>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>股票：</span>
            <template v-if="props.tradeIdGot">
              <UInput
                class="col-span-4"
                :value="dataParams.updateData.stockNo + dataParams.updateData.stockName"
                disabled />
            </template>
            <template v-else>
              <div :class="['col-span-4', dataValidate.stockNo ? '' : 'outline-1 outline-red-500']">
                <stockListSelect :stockNoGot="dataParams.updateData.stockNo" @sendbackStockNo="settingStockNo" />
              </div>
            </template>
          </div>
          <div
            class="flex justify-start items-center grid grid-cols-8"
            v-if="!dataValidate.stockNo && !props.tradeIdGot">
            <span class="col-span-4 col-end-7 text-red-500">請選擇股票</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>每股價格：</span>
            <UInputNumber
              :class="['col-start-3 col-end-5', dataValidate.pricePerShare ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.pricePerShare"
              orientation="vertical"
              :min="0"
              :step="0.01"
              @change="settingTotalPrice()" />
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>購買股數：</span>
            <UInputNumber
              :class="['col-start-7 col-end-9', dataValidate.quantity ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.quantity"
              orientation="vertical"
              @change="settingTotalPrice()" />
          </div>
          <div
            class="flex justify-start items-center grid grid-cols-8"
            v-if="!dataValidate.pricePerShare || !dataValidate.quantity">
            <span class="col-span-4 col-end-7 text-red-500">每股價格與股數需為正數</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>手續費：</span>
            <UInputNumber
              :class="['col-start-3 col-end-5', dataValidate.handlingFee ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.handlingFee"
              orientation="vertical"
              :min="0"
              :step="setStep"
              @change="settingTotalPrice()" />
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易稅：</span>
            <UInputNumber
              :class="['col-start-7 col-end-9', dataValidate.transactionTax ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.transactionTax"
              orientation="vertical"
              :min="0"
              :step="setStep"
              @change="settingTotalPrice()" />
          </div>
          <div
            class="flex justify-start items-center grid grid-cols-8"
            v-if="!dataValidate.handlingFee || !dataValidate.transactionTax">
            <span class="col-span-4 col-end-7 text-red-500">手續費與交易稅不得為負</span>
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">總價：</span>
          <UInput class="col-span-2" :value="currencyFormat(dataParams.updateData.stockTotalPrice)" disabled />
          <span class="col-span-2 text-right">交易成本：</span>
          <UInput class="col-span-2" :value="currencyFormat(dataParams.updateData.tradeTotalPrice)" disabled />
        </div>

        <div class="flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">帳戶餘額：</span>
          <UInput class="col-span-3" :value="currencyFormat(dataParams.oriData.oriRemainingAmount)" disabled />
        </div>

        <div class="flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect
              :currencyIdGot="dataParams.updateData.currency"
              isDisable
              @sendbackCurrencyData="settingCurrency" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">說明：</span>
          <UInput class="col-span-5" v-model="dataParams.updateData.tradeDescription" :disabled="!props.isEditable" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-8">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-5" v-model="dataParams.updateData.tradeNote" :disabled="!props.isEditable" />
        </div>

        <div class="my-2">
          <ui-buttonGroup :showSave="props.isEditable" @dataSave="stockAccountRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="openTradeData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchStockAccountRecordById,
  fetchStockAccountRecordCreate,
  fetchStockAccountRecordUpdate,
  fetchStockAccountRecordDelete,
} from "@/server/stockAccountRecordApi.ts";
import { IStockAccountRecordData, IStockAccountList, IStockList, ICurrencyList, IResponse } from "@/models/index.ts";
import {
  getDefaultTradeValidate,
  getDefaultStockAccount,
  getDefaultCurrency,
  getDefaultTradeCategory,
  getDefaultTransactionCategory,
} from "@/components/tradeParamsTools.ts";
import { currencyFormat, dataObjectValidate } from "@/composables/tools.ts";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog.ts";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const transactionTypeSelect = defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; accountIdGot?: string; isEditable?: boolean }>(), {
  tradeIdGot: "",
  accountIdGot: "",
  isEditable: false,
});
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): IStockAccountRecordData => ({
  updateData: {
    tradeId: props.tradeIdGot || "",
    accountId: props.accountIdGot,
    accountData: getDefaultStockAccount(),
    tradeDatetime: "",
    accountUser: "",
    transactionType: "",
    transactionCategoryData: getDefaultTransactionCategory(),
    tradeCategory: "",
    tradeCategoryData: getDefaultTradeCategory(),
    stockNo: "",
    stockName: "",
    pricePerShare: 0,
    quantity: 0,
    handlingFee: 0,
    transactionTax: 0,
    stockTotalPrice: 0,
    tradeTotalPrice: 0,
    remainingAmount: 0,
    currency: "",
    currencyData: getDefaultCurrency(),
    tradeDescription: "",
    tradeNote: "",
  },
  oriData: {
    oriTradeDatetime: "",
    oriTradeAmount: 0,
    oriRemainingAmount: 0,
    oriTransactionType: "",
  },
});
const dataParams = reactive<IStockAccountRecordData>(getDefaultDataParams());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const stockAccountChosen = ref<IStockAccountList>(getDefaultStockAccount());
const setStep = ref<number>(1);
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultTradeValidate());
    Object.assign(stockAccountChosen, getDefaultStockAccount());
    tradeAmountValidateText.value = "";
    if (props.tradeIdGot) {
      searchingStockAccountRecord();
    }
  }
});

async function searchingStockAccountRecord() {
  try {
    const res: IResponse = await fetchStockAccountRecordById({
      accountId: props.accountIdGot,
      tradeId: props.tradeIdGot,
    });
    console.log("fetchStockAccountRecordById:", res.data.data);
    Object.assign(dataParams.updateData, res.data.data);
    dataParams.oriData.oriTradeDatetime = res.data.data.tradeDatetime;
    dataParams.oriData.oriTradeAmount = res.data.data.tradeTotalPrice;
    dataParams.oriData.oriTransactionType = res.data.data.transactionType;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function settingAccount(account: IStockAccountList | null) {
  stockAccountChosen.value = account || getDefaultStockAccount();
  dataParams.updateData.accountId = stockAccountChosen.value.accountId || "";
  dataParams.updateData.currency = stockAccountChosen.value.currency || "";
  dataParams.oriData.oriRemainingAmount = stockAccountChosen.value.presentAmount;
  // console.log("stockAccountChosen:", stockAccountChosen.value);
  await settingRemainingAmount();

  if (
    openTradeData.value === true &&
    stockAccountChosen.value.accountId.length > 0 &&
    stockAccountChosen.value.openAlert === true &&
    dataParams.oriData.oriRemainingAmount < stockAccountChosen.value.alertValue
  ) {
    messageToast({
      message: `帳戶餘額已低於 ${currencyFormat(stockAccountChosen.value.alertValue)} 元`,
      icon: "warning",
    });
  }
}

async function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
}

async function settingTransactionType(type: string) {
  dataParams.updateData.transactionType = type;
  if (dataParams.updateData.accountId) {
    await settingTotalPrice();
  }
}

async function settingStockNo(stockItem: IStockList) {
  dataParams.updateData.stockNo = stockItem.stockId;
  dataParams.updateData.stockName = stockItem.stockName;
}

async function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

async function settingTotalPrice() {
  dataParams.updateData.stockTotalPrice = dataParams.updateData.pricePerShare * dataParams.updateData.quantity;
  if (dataParams.updateData.transactionType === "income") {
    dataParams.updateData.tradeTotalPrice =
      dataParams.updateData.stockTotalPrice - dataParams.updateData.handlingFee - dataParams.updateData.transactionTax;
  } else if (dataParams.updateData.transactionType === "expense") {
    dataParams.updateData.tradeTotalPrice =
      dataParams.updateData.stockTotalPrice + dataParams.updateData.handlingFee + dataParams.updateData.transactionTax;
  }
  await settingRemainingAmount();
}

async function settingRemainingAmount() {
  if (dataParams.updateData.transactionType === "income") {
    dataParams.oriData.oriRemainingAmount =
      stockAccountChosen.value.presentAmount -
      dataParams.oriData.oriTradeAmount +
      dataParams.updateData.tradeTotalPrice;
  } else if (dataParams.updateData.transactionType === "expense") {
    dataParams.oriData.oriRemainingAmount =
      stockAccountChosen.value.presentAmount +
      dataParams.oriData.oriTradeAmount -
      dataParams.updateData.tradeTotalPrice;
  }

  if (
    openTradeData.value === true &&
    stockAccountChosen.value.accountId.length > 0 &&
    dataParams.oriData.oriRemainingAmount < stockAccountChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `現金流最低允許值為：${stockAccountChosen.value.minimumValueAllowed}`;
  }
}

async function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.updateData.accountId) {
    dataValidate.accountId = false;
  }
  if (!dataParams.updateData.transactionType) {
    dataValidate.transactionType = false;
  }
  if (!dataParams.updateData.tradeDatetime) {
    dataValidate.tradeDatetime = false;
  }
  if (!dataParams.updateData.transactionType) {
    dataValidate.transactionType = false;
  }
  if (!dataParams.updateData.stockNo) {
    dataValidate.stockNo = false;
  }
  if (!dataParams.updateData.tradeCategory) {
    dataValidate.tradeCategory = false;
  }
  if (
    typeof dataParams.updateData.pricePerShare !== "number" ||
    !isFinite(dataParams.updateData.pricePerShare) ||
    dataParams.updateData.pricePerShare < 0
  ) {
    dataValidate.pricePerShare = false;
  }
  if (
    typeof dataParams.updateData.quantity !== "number" ||
    !isFinite(dataParams.updateData.quantity) ||
    dataParams.updateData.quantity < 0 ||
    dataParams.updateData.quantity % 1 !== 0
  ) {
    dataValidate.quantity = false;
  }
  if (
    typeof dataParams.updateData.handlingFee !== "number" ||
    !isFinite(dataParams.updateData.handlingFee) ||
    dataParams.updateData.handlingFee < 0
  ) {
    dataValidate.handlingFee = false;
  }
  if (
    typeof dataParams.updateData.transactionTax !== "number" ||
    !isFinite(dataParams.updateData.transactionTax) ||
    dataParams.updateData.transactionTax < 0
  ) {
    dataValidate.transactionTax = false;
  }

  return dataObjectValidate(dataValidate);
}

async function stockAccountRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeIdGot ? fetchStockAccountRecordUpdate : fetchStockAccountRecordCreate)(
      dataParams,
    );
    messageToast({ message: res.data.message });
    emits("dataReseaching");
    openTradeData.value = props.tradeIdGot.length > 0 ? true : false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function deleteTradeRecord() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除證券帳戶紀錄",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchStockAccountRecordDelete,
    apiParams: {
      tradeId: props.tradeIdGot,
      accountId: props.accountIdGot,
    },
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
