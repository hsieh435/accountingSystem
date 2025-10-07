<template>
  <UModal
    title="證券帳戶收支紀錄"
    description="資料內容"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視證券帳戶收支'" />
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
                :isDisable="props.tradeIdGot ? true : false"
                @sendbackAccount="settingAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.accountId">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">請選擇證券帳戶</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
            <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
              <dateTimeSelect :dateTimeGot="dataParams.tradeDatetime" @sendbackDateTime="settingTradeDatetime" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeDatetime">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">請填寫交易時間</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>買 / 賣：</span>
            <div :class="['col-span-2', dataValidate.transactionType ? '' : 'outline-1 outline-red-500']">
              <transactionTypeSelect
                :transactionType="dataParams.transactionType"
                @sendbackTransactionType="settingTransactionType" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.transactionType">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">請選擇買 / 賣</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isStaccountAble"
                :tradeCategoryGot="dataParams.tradeCategory"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeCategory">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">請選擇交易項目</span>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>股票：</span>
            <template v-if="props.tradeIdGot">
              <input
                :class="tailwindStyles.getInputClasses('col-span-4')"
                :value="dataParams.stockNo + dataParams.stockName"
                disabled />
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
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">請選擇股票</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isStaccountAble"
                :tradeCategoryGot="dataParams.tradeCategory"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-8" v-if="!dataValidate.tradeCategory">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">請選擇交易項目</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>每股價格：</span>
            <input
              :class="[tailwindStyles.getInputClasses(), dataValidate.pricePerShare ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.pricePerShare"
              type="number"
              class="col-start-3 col-end-5" />
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>購買股數：</span>
            <input
              :class="[tailwindStyles.getInputClasses(), dataValidate.quantity ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.quantity"
              type="number"
              class="col-start-7 col-end-9" />
          </div>
          <div
            class="flex justify-start items-center grid grid-cols-8"
            v-if="!dataValidate.pricePerShare || !dataValidate.quantity">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">每股價格與股數需為正數</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-8">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>手續費：</span>
            <input
              :class="[tailwindStyles.getInputClasses(), dataValidate.handlingFee ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.handlingFee"
              type="number"
              class="col-start-3 col-end-5" />
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易稅：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses(),
                dataValidate.transactionTax ? '' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.transactionTax"
              type="number"
              class="col-start-7 col-end-9" />
          </div>
          <div
            class="flex justify-start items-center grid grid-cols-8"
            v-if="!dataValidate.handlingFee || !dataValidate.transactionTax">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-6 text-red-500 mx-2">手續費與交易稅不得為負</span>
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">總價：</span>
          <input
            :class="tailwindStyles.getInputClasses()"
            :value="currencyFormat(dataParams.pricePerShare * dataParams.quantity)"
            disabled
            class="col-start-3 col-end-5" />
          <span class="col-span-2 text-right">交易成本：</span>
          <input
            :class="tailwindStyles.getInputClasses()"
            :value="
              currencyFormat(
                dataParams.pricePerShare * dataParams.quantity + dataParams.handlingFee + dataParams.transactionTax,
              )
            "
            disabled
            class="col-start-7 col-end-9" />
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect :currencyIdGot="dataParams.currency" :isDisable="true" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-8">
          <span class="col-span-2 text-right">說明：</span>
          <input :class="tailwindStyles.getInputClasses('col-span-5')" v-model="dataParams.tradeDescription" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-8">
          <span class="col-span-2 text-right my-1">附註：</span>
          <textarea :class="tailwindStyles.getInputClasses('col-span-5')" v-model="dataParams.tradeNote"></textarea>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="stockAccountRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
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
} from "@/server/stockAccountRecordApi";
import { IStockAccountRecordList, IStockAccountList, IStockList, IResponse } from "@/models/index";
import { currencyFormat } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const transactionTypeSelect = defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; accountIdGot?: string }>(), {
  tradeIdGot: "",
  accountIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const open = ref<boolean>(false);
const getDefaultDataParams = (): IStockAccountRecordList => ({
  tradeId: props.tradeIdGot || "",
  accountId: props.accountIdGot,
  tradeDatetime: "",
  accountUser: "",
  transactionType: "income",
  tradeCategory: "",
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
  tradeDescription: "",
  tradeNote: "",
});
const dataParams = reactive<IStockAccountRecordList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  accountId: true,
  tradeDatetime: true,
  transactionType: true,
  stockNo: true,
  tradeCategory: true,
  pricePerShare: true,
  quantity: true,
  handlingFee: true,
  transactionTax: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());
const originalRemainingAmount = ref<number>(0);
const originalTradeAmount = ref<number>(0);
const originalTradeDatetime = ref<string>("");

watch(open, () => {
  if (open.value === true) {
    if (props.tradeIdGot) {
      searchingStockAccountRecord();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingStockAccountRecord() {
  try {
    const res: IResponse = await fetchStockAccountRecordById({
      accountId: props.accountIdGot,
      tradeId: props.tradeIdGot,
    });
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      open.value = true;
    } else {
      messageToast({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

function settingAccount(account: IStockAccountList[]) {
  dataParams.accountId = account[0].accountId || "";
  dataParams.currency = account[0].currency || "";
}

function settingTradeDatetime(dateTime: string) {
  dataParams.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.transactionType = type;
}

function settingStockNo(stockItem: IStockList) {
  dataParams.stockNo = stockItem.stock_id;
  dataParams.stockName = stockItem.stock_name;
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.tradeCategory = tradeCategoryId;
}

async function validateData() {
  dataValidate.accountId = true;
  dataValidate.tradeDatetime = true;
  dataValidate.transactionType = true;
  dataValidate.stockNo = true;
  dataValidate.tradeCategory = true;
  dataValidate.pricePerShare = true;
  dataValidate.quantity = true;
  dataValidate.handlingFee = true;
  dataValidate.transactionTax = true;

  if (!dataParams.accountId) {
    dataValidate.accountId = false;
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

  if (
    !dataValidate.accountId ||
    !dataValidate.tradeDatetime ||
    !dataValidate.transactionType ||
    !dataValidate.stockNo ||
    !dataValidate.tradeCategory ||
    !dataValidate.pricePerShare ||
    !dataValidate.quantity ||
    !dataValidate.handlingFee ||
    !dataValidate.transactionTax
  ) {
    return false;
  } else {
    return true;
  }
}

async function stockAccountRecordDataHandling() {
  if (!(await validateData())) return;

  dataParams.stockTotalPrice = dataParams.pricePerShare * dataParams.quantity;
  dataParams.tradeTotalPrice = dataParams.stockTotalPrice + dataParams.handlingFee + dataParams.transactionTax;

  try {
    const res: IResponse = await (props.tradeIdGot ? fetchStockAccountRecordUpdate : fetchStockAccountRecordCreate)(
      dataParams,
    );
    if (res.data.returnCode === 0) {
      messageToast({ message: res.data.message });
      emits("dataReseaching");
      open.value = false;
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
