<template>
  <UModal
    title="銀行帳戶收支紀錄"
    description="資料內容"
    v-model:open="openTradeData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視銀行帳戶收支'" />
      <ui-buttonGroup showRemove :removeText="'刪除銀行帳戶收支'" @dataRemove="deleteTradeRecord" />
    </template>
    <template v-if="!props.tradeIdGot">
      <ui-buttonGroup showCreate :createText="'新增銀行帳戶收支'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>存款帳戶：</span>
          <div :class="['w-fit', dataValidate.accountId ? '' : 'outline-1 outline-red-500']">
            <accountSelect
              selectTargetId="isCuaccountAble"
              :accountIdGot="dataParams.updateData.accountId"
              :sellectAll="false"
              :isDisable="props.tradeIdGot ? true : false"
              @sendbackAccount="settingAccount" />
          </div>
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.accountId">
          <span class="col-start-3 col-span-4 text-red-500">請選擇存款帳戶</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
            <dateTimeSelect
              :dateTimeGot="dataParams.updateData.tradeDatetime"
              @sendbackDateTime="settingTradeDatetime" />
          </div>
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeDatetime">
          <span class="col-start-3 col-span-4 text-red-500">請填寫交易時間</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
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

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
          <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
            <tradeCategorySelect
              accountType="isCuaccountAble"
              :tradeCategoryGot="dataParams.updateData.tradeCategory"
              @sendbackTradeCategory="settingTradeCategory" />
          </div>
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCategory">
          <span class="col-start-3 col-span-4 text-red-500">請選擇收支項目</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
          <UInputNumber
            :class="['col-span-3', dataValidate.tradeAmount ? '' : 'outline-1 outline-red-500']"
            v-model="dataParams.updateData.tradeAmount"
            orientation="vertical"
            :min="0"
            :step="setStep"
            @update:modelValue="settingRemainingAmount()" />
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
          <span class="col-start-3 col-span-4 text-red-500">{{ tradeAmountValidateText }}</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">餘額：</span>
          <UInput class="col-span-3" :value="currencyFormat(dataParams.updateData.remainingAmount)" disabled />
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
          <ui-buttonGroup showSave @dataSave="currencyAccountRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="openTradeData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchCurrencyAccountRecordById,
  fetchCurrencyAccountRecordCreate,
  fetchCurrencyAccountRecordUpdate,
} from "@/server/currencyAccountRecordApi.ts";
import { IcurrencyAccountRecordData, ICurrencyAccountList, ICurrencyList, IResponse } from "@/models/index.ts";
import { getDefaultTradeValidate, getDefaultCurrencyAccount } from "@/components/financeRecord/tradeDataTools.ts";
import { currencyFormat, dataObjectValidate } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const transactionTypeSelect = defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; accountIdGot?: string }>(), {
  tradeIdGot: "",
  accountIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): IcurrencyAccountRecordData => ({
  updateData: {
    tradeId: props.tradeIdGot || "",
    accountId: props.accountIdGot,
    tradeDatetime: "",
    accountUser: "",
    accountType: "",
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
const dataParams = reactive<IcurrencyAccountRecordData>(getDefaultDataParams());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const originalRemainingAmount = ref<number>(0);
const originalTradeAmount = ref<number>(0);
const originalTradeDatetime = ref<string>("");
const storedValueCardChosen = ref<ICurrencyAccountList>(getDefaultCurrencyAccount());
const setStep = ref<number>(1);
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    if (props.tradeIdGot) {
      searchingCurrencyAccountRecord();
    }
  } else if (openTradeData.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultTradeValidate());
    Object.assign(storedValueCardChosen, getDefaultCurrencyAccount());
    originalTradeDatetime.value = "";
    originalRemainingAmount.value = 0;
    originalTradeAmount.value = 0;
    tradeAmountValidateText.value = "";
  }
});

async function searchingCurrencyAccountRecord() {
  try {
    const res: IResponse = await fetchCurrencyAccountRecordById({
      accountId: props.accountIdGot,
      tradeId: props.tradeIdGot,
    });
    Object.assign(dataParams, res.data.data);
    originalTradeDatetime.value = res.data.data.tradeDatetime;

    originalTradeAmount.value = res.data.data.tradeAmount;
    if (res.data.data.transactionType === "income") {
      originalRemainingAmount.value = res.data.data.remainingAmount - res.data.data.tradeAmount;
    } else if (res.data.data.transactionType === "expense") {
      originalRemainingAmount.value = res.data.data.remainingAmount + res.data.data.tradeAmount;
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

function settingAccount(account: ICurrencyAccountList | null) {
  storedValueCardChosen.value = account || getDefaultCurrencyAccount();
  dataParams.updateData.accountId = storedValueCardChosen.value.accountId || "";
  dataParams.updateData.currency = storedValueCardChosen.value.currency || "";

  if (props.tradeIdGot.length > 0 && account) {
    if (dataParams.updateData.transactionType === "income") {
      originalRemainingAmount.value = account.presentAmount - originalTradeAmount.value;
    } else if (dataParams.updateData.transactionType === "expense") {
      originalRemainingAmount.value = account.presentAmount + originalTradeAmount.value;
    }
  } else {
    originalRemainingAmount.value = storedValueCardChosen.value.presentAmount || 0;
  }
  // console.log("storedValueCardChosen:", storedValueCardChosen.value);
  settingRemainingAmount();
}

function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.updateData.transactionType = type;
  if (dataParams.updateData.accountId) {
    settingRemainingAmount();
  }
}

async function settingRemainingAmount() {
  dataParams.updateData.tradeAmount =
    typeof dataParams.updateData.tradeAmount === "number" ? Number(dataParams.updateData.tradeAmount) : 0;
  //
  if (dataParams.updateData.transactionType === "income") {
    dataParams.updateData.remainingAmount = originalRemainingAmount.value + dataParams.updateData.tradeAmount;
  } else if (dataParams.updateData.transactionType === "expense") {
    dataParams.updateData.remainingAmount = originalRemainingAmount.value - dataParams.updateData.tradeAmount;
  }
  // console.log("originalRemainingAmount:", originalRemainingAmount.value);
  // console.log("tradeAmount:", dataParams.updateData.tradeAmount, Number(dataParams.updateData.tradeAmount));
  // console.log("remainingAmount:", dataParams.updateData.remainingAmount, Number(dataParams.updateData.remainingAmount));
  // console.log("storedValueCardChosen:", storedValueCardChosen.value);

  if (
    storedValueCardChosen.value &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.updateData.remainingAmount < storedValueCardChosen.value.alertValue
  ) {
    messageToast({
      message: `帳戶餘額已低於 ${currencyFormat(storedValueCardChosen.value.alertValue)} 元`,
      icon: "warning",
    });
  }
  if (
    storedValueCardChosen.value &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.updateData.remainingAmount < storedValueCardChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `現金流最低允許值為：${storedValueCardChosen.value.minimumValueAllowed}`;
  }
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.updateData.accountId) {
    dataValidate.accountId = false;
  }
  if (!dataParams.updateData.tradeDatetime) {
    dataValidate.tradeDatetime = false;
  }
  if (!dataParams.updateData.transactionType) {
    dataValidate.transactionType = false;
  }
  if (!dataParams.updateData.tradeCategory) {
    dataValidate.tradeCategory = false;
  }
  if (
    typeof dataParams.updateData.tradeAmount !== "number" ||
    !isFinite(dataParams.updateData.tradeAmount) ||
    dataParams.updateData.tradeAmount < 0
  ) {
    dataValidate.tradeAmount = false;
    // tradeAmountValidateText.value = "交易金額不得為負";
  }

  return dataObjectValidate(dataValidate);
}

async function currencyAccountRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (
      props.tradeIdGot ? fetchCurrencyAccountRecordUpdate : fetchCurrencyAccountRecordCreate
    )(dataParams);
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
