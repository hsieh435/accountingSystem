<template>
  <UModal
    title="現金收支紀錄"
    description="資料內容"
    v-model:open="openTradeData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視現金收支'" />
      <ui-buttonGroup showRemove :removeText="'刪除現金收支'" @dataRemove="deleteTradeRecord" />
    </template>
    <template v-if="!props.tradeIdGot">
      <ui-buttonGroup showCreate :createText="'新增現金收支'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>現金流：</span>
            <div :class="['w-fit', dataValidate.cashflowId ? '' : 'outline-1 outline-red-500']">
              <accountSelect
                selectTargetId="isCashflowAble"
                :accountIdGot="dataParams.updateData.cashflowId"
                :sellectAll="false"
                :isDisable="props.tradeIdGot ? true : false"
                @sendbackAccount="settingCashflowAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.transactionType">
            <span class="col-start-3 col-span-4 text-red-500">請選擇收支</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
            <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
              <dateTimeSelect
                :dateTimeGot="dataParams.updateData.tradeDatetime"
                @sendbackDateTime="settingTradeDatetime" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeDatetime">
            <span class="col-start-3 col-span-4 text-red-500">請選擇交易時間</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支：</span>
            <div :class="['col-span-2', dataValidate.transactionType ? '' : 'outline-1 outline-red-500']">
              <transactionTypeSelect
                :transactionType="dataParams.updateData.transactionType"
                @sendbackTransactionType="settingTransactionType" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.transactionType">
            <span class="col-start-3 col-span-4 text-red-500">請選擇收支</span>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isCashflowAble"
                :tradeCategoryGot="dataParams.updateData.tradeCategory"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCategory">
            <span class="col-start-3 col-span-4 text-red-500">請選擇收支項目</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.tradeAmount ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.tradeAmount"
              orientation="vertical"
              :min="0"
              @update:modelValue="settingRemainingAmount()" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-start-3 col-span-4 text-red-500">{{ tradeAmountValidateText }}</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">餘額：</span>
            <UInput class="col-span-3" :value="currencyFormat(dataParams.updateData.remainingAmount)" disabled />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect
              :currencyIdGot="dataParams.updateData.currency"
              isDisable
              @sendbackCurrencyData="settingCurrency" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">說明：</span>
          <UInput class="col-span-3" v-model="dataParams.updateData.tradeDescription" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-3" v-model="dataParams.updateData.tradeNote" />
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="cashFlowRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="openTradeData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchCashFlowRecordByTradeId,
  fetchCashFlowRecordCreate,
  fetchCashFlowRecordUpdate,
} from "@/server/cashFlowRecordApi.ts";
import { ICashFlowRecordData, ICashFlowList, ICurrencyList, IResponse } from "@/models/index.ts";
import { getDefaultTradeValidate, getDefaultCashFlow } from "@/components/financeRecord/tradeDataTools.ts";
import { currencyFormat, dataObjectValidate } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";


const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const transactionTypeSelect = defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; cashflowIdGot?: string }>(), {
  tradeIdGot: "",
  cashflowIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): ICashFlowRecordData => ({
  updateData: {
    tradeId: props.tradeIdGot || "",
    cashflowId: "",
    userId: "",
    tradeDatetime: "",
    accountType: "cashFlow",
    transactionType: "income",
    tradeCategory: "",
    tradeAmount: 0,
    remainingAmount: 0,
    currency: "",
    tradeDescription: "",
    tradeNote: "",
  },
  oriData: {
    oriTradeDatetime: "",
    oriTradeAmount: 0,
    oriRemainingAmount: 0,
    oriTransactionType: "income",
  },
});
const dataParams = reactive<ICashFlowRecordData>(getDefaultDataParams());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const cashFlowChosen = ref<ICashFlowList>(getDefaultCashFlow());
const setStep = ref<number>(1);
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    if (props.tradeIdGot) {
      searchingCashFlowRecord();
    }
    // else {
    //   Object.assign(dataParams, getDefaultDataParams());
    //   Object.assign(cashFlowChosen, getDefaultCashFlow());
    //   Object.assign(dataValidate, getDefaultTradeValidate());
    //   tradeAmountValidateText.value = "";
    // }
  } else {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(cashFlowChosen, getDefaultCashFlow());
    Object.assign(dataValidate, getDefaultTradeValidate());
    tradeAmountValidateText.value = "";
  }
});

async function searchingCashFlowRecord() {
  try {
    const res: IResponse = await fetchCashFlowRecordByTradeId({
      cashflowId: props.cashflowIdGot,
      tradeId: props.tradeIdGot,
    });
    console.log("fetchCashFlowRecordByTradeId:", res.data.data);
    Object.assign(dataParams.updateData, res.data.data);
    dataParams.oriData.oriTradeDatetime = res.data.data.tradeDatetime;
    dataParams.oriData.oriTradeAmount = res.data.data.tradeAmount;
    dataParams.oriData.oriTransactionType = res.data.data.transactionType;
    //
    if (res.data.data.transactionType === "income") {
      dataParams.oriData.oriRemainingAmount = res.data.data.remainingAmount - res.data.data.tradeAmount;
    } else if (res.data.data.transactionType === "expense") {
      dataParams.oriData.oriRemainingAmount = res.data.data.remainingAmount + res.data.data.tradeAmount;
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

function settingCashflowAccount(account: ICashFlowList | null) {
  console.log("account:", account);
  cashFlowChosen.value = account || getDefaultCashFlow();
  dataParams.updateData.cashflowId = cashFlowChosen.value.cashflowId || "";
  dataParams.updateData.currency = cashFlowChosen.value.currency || "";
  //
  if (account === null) {
    dataParams.updateData.remainingAmount = 0;
  } else {
    settingRemainingAmount();
  }
}

function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.updateData.transactionType = type;
  settingRemainingAmount();
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

async function settingRemainingAmount() {
  //
  if (dataParams.updateData.transactionType === "income") {
    console.log("收入");
    dataParams.updateData.remainingAmount =
      Number(dataParams.oriData.oriRemainingAmount) + dataParams.updateData.tradeAmount;
  } else if (dataParams.updateData.transactionType === "expense") {
    console.log("支出");
    dataParams.updateData.remainingAmount =
      Number(dataParams.oriData.oriRemainingAmount) - dataParams.updateData.tradeAmount;
  }
  console.log("remainingAmount:", dataParams.updateData.remainingAmount);
  console.log("cashFlowChosen:", cashFlowChosen.value);

  if (
    openTradeData.value === true &&
    props.tradeIdGot &&
    dataParams.updateData.remainingAmount < cashFlowChosen.value.alertValue &&
    cashFlowChosen.value.openAlert === true
  ) {
    messageToast({
      message: `${dataParams.updateData.remainingAmount} V.S ${currencyFormat(cashFlowChosen.value.alertValue)} 元`,
      // message: `現金餘額已低於 ${currencyFormat(cashFlowChosen.value.alertValue)} 元`,
      icon: "warning",
    });
  }
  if (cashFlowChosen.value && dataParams.updateData.remainingAmount < cashFlowChosen.value.minimumValueAllowed) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `現金流最低允許值為：${cashFlowChosen.value.minimumValueAllowed}`;
  } else {
    dataValidate.tradeAmount = true;
  }
}

function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.updateData.tradeCategory) {
    dataValidate.tradeCategory = false;
  }

  if (
    typeof dataParams.updateData.tradeAmount !== "number" ||
    !isFinite(dataParams.updateData.tradeAmount) ||
    dataParams.updateData.tradeAmount < 0
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = "交易金額不得為負";
  }

  return dataObjectValidate(dataValidate);
}

async function cashFlowRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeIdGot ? fetchCashFlowRecordUpdate : fetchCashFlowRecordCreate)(dataParams);
    messageToast({ message: res.data.message });
    emits("dataReseaching");
    openTradeData.value = false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}



async function deleteTradeRecord() {
  console.log(850000);
}
</script>
<style lang="scss" scoped></style>
