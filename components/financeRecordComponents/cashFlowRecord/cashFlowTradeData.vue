<template>
  <UModal
    title="現金收支紀錄"
    description="資料內容"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視現金收支'" />
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
                :accountIdGot="dataParams.cashflowId"
                :isDisable="props.tradeIdGot ? true : false"
                @sendbackAccount="settingCashflowAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.transactionType">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇收支</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
            <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
              <dateTimeSelect :dateTimeGot="dataParams.tradeDatetime" @sendbackDateTime="settingTradeDatetime" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeDatetime">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇交易時間</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支：</span>
            <div :class="['col-span-2', dataValidate.transactionType ? '' : 'outline-1 outline-red-500']">
              <transactionTypeSelect
                :transactionType="dataParams.transactionType"
                @sendbackTransactionType="settingTransactionType" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.transactionType">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇收支</span>
          </div>
        </div>

        <div class="w-full">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isCashflowAble"
                :tradeCategoryGot="dataParams.tradeCategory"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCategory">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇收支項目</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.tradeAmount ? '' : 'outline-1 outline-red-500']"
              orientation="vertical"
              v-model="dataParams.tradeAmount"
              @change="settingRemainingAmount()" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ tradeAmountValidateText }}</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>餘額：</span>
            <input
              :class="tailwindStyles.getInputClasses('col-span-3')"
              :value="currencyFormat(dataParams.remainingAmount)"
              disabled />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect :currencyIdGot="dataParams.currency" :isDisable="true" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">說明：</span>
          <input :class="tailwindStyles.getInputClasses('col-span-3')" v-model="dataParams.tradeDescription" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <textarea :class="tailwindStyles.getInputClasses('col-span-3')" v-model="dataParams.tradeNote"></textarea>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="cashFlowRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
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
} from "@/server/cashFlowRecordApi";
import { ICashFlowRecordList, ICashFlowList, IResponse } from "@/models/index";
import { currencyFormat } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

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

const open = ref<boolean>(false);
const getDefaultDataParams = (): ICashFlowRecordList => ({
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
});
const dataParams = reactive<ICashFlowRecordList>(getDefaultDataParams());
const originalRemainingAmount = ref<number>(0);
const originalTradeAmount = ref<number>(0);
const originalTradeDatetime = ref<string>("");
const getDefaultDataValidate = (): any => ({
  cashflowId: true,
  tradeDatetime: true,
  transactionType: true,
  tradeCategory: true,
  tradeAmount: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());
const cashFlowChosen = ref<ICashFlowList>({} as ICashFlowList);
const tradeAmountValidateText = ref<string>("");

watch(open, () => {
  if (open.value === true) {
    if (props.tradeIdGot) {
      searchingCashFlowRecord();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
    Object.assign(cashFlowChosen, {} as ICashFlowList);
    tradeAmountValidateText.value = "";
    originalRemainingAmount.value = 0;
    originalTradeAmount.value = 0;
    originalTradeDatetime.value = "";
  }
});

async function searchingCashFlowRecord() {
  try {
    const res: IResponse = await fetchCashFlowRecordByTradeId({
      cashflowId: props.cashflowIdGot,
      tradeId: props.tradeIdGot,
    });
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      originalTradeDatetime.value = res.data.data.tradeDatetime;

      originalTradeAmount.value = res.data.data.tradeAmount;
      if (res.data.data.transactionType === "income") {
        originalRemainingAmount.value = res.data.data.remainingAmount - res.data.data.tradeAmount;
      } else if (res.data.data.transactionType === "expense") {
        originalRemainingAmount.value = res.data.data.remainingAmount + res.data.data.tradeAmount;
      }
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

function settingCashflowAccount(account: ICashFlowList[]) {
  dataParams.cashflowId = account[0].cashflowId || "";
  dataParams.currency = account[0].currency || "";
  // dataParams.remainingAmount = account.presentAmount;
  if (props.tradeIdGot.length > 0 && account.length === 1) {
    if (dataParams.transactionType === "income") {
      originalRemainingAmount.value = account[0].presentAmount - originalTradeAmount.value;
    } else if (dataParams.transactionType === "expense") {
      originalRemainingAmount.value = account[0].presentAmount + originalTradeAmount.value;
    }
  } else {
    originalRemainingAmount.value = account[0].presentAmount || 0;
  }
  cashFlowChosen.value = account[0] || ({} as ICashFlowList);
  console.log("cashFlowChosen:", cashFlowChosen.value);
  settingRemainingAmount();
}

function settingTradeDatetime(dateTime: string) {
  dataParams.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.transactionType = type;
  settingRemainingAmount();
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.tradeCategory = tradeCategoryId;
}

function settingRemainingAmount() {
  dataParams.tradeAmount = typeof dataParams.tradeAmount === "number" ? Number(dataParams.tradeAmount) : 0;
  //
  if (dataParams.transactionType === "income") {
    dataParams.remainingAmount = originalRemainingAmount.value + dataParams.tradeAmount;
  } else if (dataParams.transactionType === "expense") {
    dataParams.remainingAmount = originalRemainingAmount.value - dataParams.tradeAmount;
  }
  // console.log("originalRemainingAmount:", originalRemainingAmount.value);
  // console.log("originalTradeAmount:", originalTradeAmount.value);
  // console.log("remainingAmount:", dataParams.remainingAmount);
  // console.log("dataParams:", dataParams);

  if (
    cashFlowChosen.value &&
    cashFlowChosen.value.openAlert === true &&
    dataParams.remainingAmount < cashFlowChosen.value.alertValue
  ) {
    messageToast({ message: `現金流餘額低於警示值 ${cashFlowChosen.value.alertValue}`, icon: "warning" });
  }
  if (
    cashFlowChosen.value &&
    cashFlowChosen.value.openAlert === true &&
    dataParams.remainingAmount < cashFlowChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `現金流最低允許值為：${cashFlowChosen.value.minimumValueAllowed}`;
  }
}

async function validateData() {
  dataValidate.cashflowId = !dataParams.cashflowId ? false : true;
  dataValidate.tradeDatetime = !dataParams.tradeDatetime ? false : true;
  dataValidate.transactionType = !dataParams.transactionType ? false : true;
  dataValidate.tradeCategory = !dataParams.tradeCategory ? false : true;

  if (typeof dataParams.tradeAmount !== "number" || !isFinite(dataParams.tradeAmount) || dataParams.tradeAmount < 0) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = "交易金額不得為負";
  }

  if (
    !dataValidate.cashflowId ||
    !dataValidate.tradeDatetime ||
    !dataValidate.transactionType ||
    !dataValidate.tradeCategory ||
    !dataValidate.tradeAmount
  ) {
    return false;
  } else {
    return true;
  }
}

async function cashFlowRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeIdGot ? fetchCashFlowRecordUpdate : fetchCashFlowRecordCreate)(dataParams);
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
