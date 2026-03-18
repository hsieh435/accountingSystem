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
                :accountIdGot="dataParams.accountId"
                :sellectAll="false"
                :isDisable="props.tradeIdGot ? true : false"
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
                :dateTimeGot="dataParams.tradeDatetime"
                :isDisabled="!props.isEditable"
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
                :transactionType="dataParams.transactionType"
                :isDisabled="!props.isEditable"
                @sendbackTransactionType="settingTransactionType" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.transactionType">
            <span class="col-span-4 col-end-7 text-red-500">請選擇買 / 賣</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isStaccountAble"
                :tradeCategoryGot="dataParams.tradeCategory"
                :isEditable="props.isEditable"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeCategory">
            <span class="col-start-3 col-span-4 text-red-500">請選擇收支項目</span>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>股票：</span>
            <template v-if="props.tradeIdGot">
              <UInput class="col-span-4" :value="dataParams.stockNo + dataParams.stockName" disabled />
            </template>
            <template v-else>
              <div :class="['col-span-4', dataValidate.stockNo ? '' : 'outline-1 outline-red-500']">
                <stockListSelect :stockNoGot="dataParams.stockNo" @sendbackStockNo="settingStockNo" />
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
              v-model="dataParams.pricePerShare"
              orientation="vertical"
              :min="0"
              :step="0.01"
              :disabled="!props.isEditable"
              @change="settingTotalPrice()" />
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>購買股數：</span>
            <UInputNumber
              :class="['col-start-7 col-end-9', dataValidate.quantity ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.quantity"
              orientation="vertical"
              :disabled="!props.isEditable"
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
              v-model="dataParams.handlingFee"
              orientation="vertical"
              :min="0"
              :step="setStep"
              :disabled="!props.isEditable"
              @change="settingTotalPrice()" />
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易稅：</span>
            <UInputNumber
              :class="['col-start-7 col-end-9', dataValidate.transactionTax ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.transactionTax"
              orientation="vertical"
              :min="0"
              :step="setStep"
              :disabled="!props.isEditable"
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
          <UInput class="col-span-2" :value="currencyFormat(dataParams.stockTotalPrice)" disabled />
          <span class="col-span-2 text-right">交易成本：</span>
          <UInput class="col-span-2" :value="currencyFormat(dataParams.tradeTotalPrice)" disabled />
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right">帳戶餘額：</span>
            <UInput :class="['col-span-4', dataValidate.tradeTotalPrice ? '' : 'outline-1 outline-red-500']" :value="currencyFormat(oriRemainingAmount)" disabled />
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeTotalPrice">
            <span class="col-span-4 col-end-7 text-red-500">{{ tradeTotalPriceValidateText }}</span>
          </div>
        </div>

        <div class="flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect
              :currencyIdGot="dataParams.currency"
              isDisable
              @sendbackCurrencyData="settingCurrency" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">說明：</span>
          <UInput class="col-span-5" v-model="dataParams.tradeDescription" :disabled="!props.isEditable" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-8">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-5" v-model="dataParams.tradeNote" :disabled="!props.isEditable" />
        </div>

        <div class="my-2" v-if="props.isEditable">
          <ui-buttonGroup showSave @dataSave="stockAccountRecordDataHandling" />
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
import { IStockAccountRecordList, IStockAccountList, IStockList, ICurrencyList, IResponse } from "@/models/index.ts";
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
const getDefaultDataParams = (): IStockAccountRecordList => ({
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
  createdDatetime: "",
  editedDatetime: "",
});
const dataParams = reactive<IStockAccountRecordList>(getDefaultDataParams());
const stockAccountChosen = ref<IStockAccountList>(getDefaultStockAccount());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const setStep = ref<number>(1);
const oriTradeAmount = ref<number>(0);
const oriRemainingAmount = ref<number>(0);
const oriTransactionType = ref<string>("");
const tradeTotalPriceValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(stockAccountChosen, getDefaultStockAccount());
    Object.assign(dataValidate, getDefaultTradeValidate());
    setStep.value = 1;
    oriTradeAmount.value = 0;
    oriRemainingAmount.value = 0;
    oriTransactionType.value = "";
    tradeTotalPriceValidateText.value = "";
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
    Object.assign(dataParams, res.data.data);
    oriTradeAmount.value = res.data.data.tradeTotalPrice;
    oriTransactionType.value = res.data.data.transactionType;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function settingAccount(account: IStockAccountList | null) {
  stockAccountChosen.value = account || getDefaultStockAccount();
  dataParams.accountId = stockAccountChosen.value.accountId || "";
  dataParams.currency = stockAccountChosen.value.currency || "";
  console.log("stockAccountChosen:", stockAccountChosen.value);
  await settingRemainingAmount();

  if (
    openTradeData.value === true &&
    stockAccountChosen.value.accountId.length > 0 &&
    stockAccountChosen.value.openAlert === true &&
    oriRemainingAmount.value < stockAccountChosen.value.alertValue
  ) {
    messageToast({
      message: `帳戶餘額已低於 ${currencyFormat(stockAccountChosen.value.alertValue)} 元`,
      icon: "warning",
    });
  }
}

async function settingTradeDatetime(dateTime: string) {
  dataParams.tradeDatetime = dateTime;
}

async function settingTransactionType(type: string) {
  dataParams.transactionType = type;
  if (dataParams.transactionType.length > 0) {
    await settingRemainingAmount();
  }
}

async function settingTradeCategory(tradeCategoryId: string) {
  dataParams.tradeCategory = tradeCategoryId;
}

async function settingStockNo(stockItem: IStockList) {
  dataParams.stockNo = stockItem.stockId;
  dataParams.stockName = stockItem.stockName;
}

async function settingTotalPrice() {
  dataParams.stockTotalPrice = dataParams.pricePerShare * dataParams.quantity;
  if (dataParams.transactionType === "income") {
    dataParams.tradeTotalPrice = dataParams.stockTotalPrice - dataParams.handlingFee - dataParams.transactionTax;
  } else if (dataParams.transactionType === "expense") {
    dataParams.tradeTotalPrice = dataParams.stockTotalPrice + dataParams.handlingFee + dataParams.transactionTax;
  }
  await settingRemainingAmount();
}

async function settingRemainingAmount() {

  oriRemainingAmount.value = stockAccountChosen.value.presentAmount;
  if (dataParams.transactionType === "income") {
    oriRemainingAmount.value =
      stockAccountChosen.value.presentAmount - oriTradeAmount.value + dataParams.tradeTotalPrice;
    if (oriTransactionType.value === "expense") {
      oriRemainingAmount.value = oriRemainingAmount.value + oriTradeAmount.value * 2;
    }
  } else if (dataParams.transactionType === "expense") {
    oriRemainingAmount.value =
      stockAccountChosen.value.presentAmount + oriTradeAmount.value - dataParams.tradeTotalPrice;
    if (oriTransactionType.value === "income") {
      oriRemainingAmount.value = oriRemainingAmount.value - oriTradeAmount.value * 2;
    }
  }

}

async function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.accountId) {
    dataValidate.accountId = false;
  }
  if (!dataParams.transactionType) {
    dataValidate.transactionType = false;
  }
  if (!dataParams.tradeDatetime) {
    dataValidate.tradeDatetime = false;
  }
  if (!dataParams.transactionType) {
    dataValidate.transactionType = false;
  }
  if (!dataParams.stockNo) {
    dataValidate.stockNo = false;
  }
  if (!dataParams.tradeCategory) {
    dataValidate.tradeCategory = false;
  }
  if (
    typeof dataParams.pricePerShare !== "number" ||
    !isFinite(dataParams.pricePerShare) ||
    dataParams.pricePerShare < 0
  ) {
    dataValidate.pricePerShare = false;
  }
  if (
    typeof dataParams.quantity !== "number" ||
    !isFinite(dataParams.quantity) ||
    dataParams.quantity < 0 ||
    dataParams.quantity % 1 !== 0
  ) {
    dataValidate.quantity = false;
  }
  if (typeof dataParams.handlingFee !== "number" || !isFinite(dataParams.handlingFee) || dataParams.handlingFee < 0) {
    dataValidate.handlingFee = false;
  }
  if (
    typeof dataParams.transactionTax !== "number" ||
    !isFinite(dataParams.transactionTax) ||
    dataParams.transactionTax < 0
  ) {
    dataValidate.transactionTax = false;
  }
  if (dataParams.accountId.length > 0 && oriRemainingAmount.value < stockAccountChosen.value.minimumValueAllowed) {
    dataValidate.tradeTotalPrice = false;
    tradeTotalPriceValidateText.value = `現金流最低允許值為：${stockAccountChosen.value.minimumValueAllowed}`;
  } else {
    dataValidate.tradeTotalPrice = true;
    tradeTotalPriceValidateText.value = "";
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
