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
      <ui-buttonGroup :showRemove="props.isEditable" :removeText="'刪除銀行帳戶收支'" @dataRemove="deleteTradeRecord" />
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
              :accountIdGot="dataParams.accountId"
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
              :dateTimeGot="dataParams.tradeDatetime"
              :isDisabled="!props.isEditable"
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
              :transactionType="dataParams.transactionType"
              :isDisabled="!props.isEditable"
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
              :tradeCategoryGot="dataParams.tradeCategory"
              :isEditable="props.isEditable"
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
            v-model="dataParams.tradeAmount"
            orientation="vertical"
            :min="0"
            :step="setStep"
              :disabled="!props.isEditable"
            @update:modelValue="settingRemainingAmount()" />
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
          <span class="col-start-3 col-span-4 text-red-500">{{ tradeAmountValidateText }}</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">帳戶餘額：</span>
          <UInput class="col-span-3" :value="currencyFormat(oriRemainingAmount)" disabled />
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect
              :currencyIdGot="dataParams.currency"
              isDisable
              @sendbackCurrencyData="settingCurrency" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">說明：</span>
          <UInput class="col-span-3" v-model="dataParams.tradeDescription" :disabled="!props.isEditable" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-3" v-model="dataParams.tradeNote" :disabled="!props.isEditable" />
        </div>

        <div class="my-2" v-if="props.isEditable">
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
  fetchCurrencyAccountRecordDelete,
} from "@/server/currencyAccountRecordApi.ts";
import { IcurrencyAccountRecordList, ICurrencyAccountList, ICurrencyList, IResponse } from "@/models/index.ts";
import {
  getDefaultTradeValidate,
  getDefaultCurrencyAccount,
  getDefaultCurrency,
  getDefaultTradeCategory,
  getDefaultTransactionCategory,
} from "@/components/tradeParamsTools.ts";
import { currencyFormat, dataObjectValidate } from "@/composables/tools.ts";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog.ts";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
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
const getDefaultDataParams = (): IcurrencyAccountRecordList => ({
    tradeId: props.tradeIdGot || "",
    accountId: props.accountIdGot,
    accountData: getDefaultCurrencyAccount(),
    tradeDatetime: "",
    accountUser: "",
    accountType: "",
    transactionType: "",
    tradeCategory: "",
    tradeAmount: 0,
    remainingAmount: 0,
    currency: "",
    currencyData: getDefaultCurrency(),
    tradeDescription: "",
    tradeNote: "",
    transactionCategoryData: getDefaultTransactionCategory(),
    tradeCategoryData: getDefaultTradeCategory(),
    createdDatetime: "",
    editedDatetime: "",
});
const dataParams = reactive<IcurrencyAccountRecordList>(getDefaultDataParams());
const currencyAccountChosen = ref<ICurrencyAccountList>(getDefaultCurrencyAccount());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const setStep = ref<number>(1);
const oriTradeAmount = ref<number>(0);
const oriRemainingAmount = ref<number>(0);
const oriTransactionType = ref<string>("");
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(currencyAccountChosen, getDefaultCurrencyAccount());
    Object.assign(dataValidate, getDefaultTradeValidate());
    setStep.value = 1;
    oriTradeAmount.value = 0;
    oriRemainingAmount.value = 0;
    oriTransactionType.value = "";
    tradeAmountValidateText.value = "";
    if (props.tradeIdGot) {
      searchingCurrencyAccountRecord();
    }
  }
});

async function searchingCurrencyAccountRecord() {
  try {
    const res: IResponse = await fetchCurrencyAccountRecordById({
      accountId: props.accountIdGot,
      tradeId: props.tradeIdGot,
    });
    Object.assign(dataParams, res.data.data);
    oriTradeAmount.value = res.data.data.tradeAmount;
    oriTransactionType.value = res.data.data.transactionType;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function settingAccount(account: ICurrencyAccountList | null) {
  currencyAccountChosen.value = account || getDefaultCurrencyAccount();
  dataParams.accountId = currencyAccountChosen.value.accountId || "";
  dataParams.currency = currencyAccountChosen.value.currency || "";
  // console.log("currencyAccountChosen:", currencyAccountChosen.value);
  await settingRemainingAmount();

  if (
    openTradeData.value === true &&
    currencyAccountChosen.value.accountId.length > 0 &&
    currencyAccountChosen.value.openAlert === true &&
    oriRemainingAmount.value < currencyAccountChosen.value.minimumValueAllowed
  ) {
    messageToast({
      message: `帳戶餘額已低於 ${currencyFormat(currencyAccountChosen.value.alertValue)} 元`,
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

async function settingRemainingAmount() {

  oriRemainingAmount.value = currencyAccountChosen.value.presentAmount;
  if (dataParams.accountId.length > 0 && dataParams.transactionType === "income") {
    oriRemainingAmount.value = currencyAccountChosen.value.presentAmount - oriTradeAmount.value + dataParams.tradeAmount;
    if (oriTransactionType.value === "expense") {
      oriRemainingAmount.value = oriRemainingAmount.value + oriTradeAmount.value * 2;
    }
  } else if (dataParams.accountId.length > 0 && dataParams.transactionType === "expense") {
    oriRemainingAmount.value = currencyAccountChosen.value.presentAmount + oriTradeAmount.value - dataParams.tradeAmount;
    if (oriTransactionType.value === "income") {
      oriRemainingAmount.value = oriRemainingAmount.value - oriTradeAmount.value * 2;
    }
  } else if (!dataParams.accountId || !dataParams.transactionType) {
    oriRemainingAmount.value = 0;
  }

  if (
    openTradeData.value === true &&
    currencyAccountChosen.value.accountId.length > 0 &&
    currencyAccountChosen.value.openAlert === true &&
    oriRemainingAmount.value < currencyAccountChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `現金流最低允許值為：${currencyAccountChosen.value.minimumValueAllowed}`;
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
  if (!dataParams.tradeCategory) {
    dataValidate.tradeCategory = false;
  }
  if (
    typeof dataParams.tradeAmount !== "number" ||
    !isFinite(dataParams.tradeAmount) ||
    dataParams.tradeAmount < 0
  ) {
    dataValidate.tradeAmount = false;
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
    openTradeData.value = props.tradeIdGot.length > 0 ? true : false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function deleteTradeRecord() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除存款帳戶紀錄",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCurrencyAccountRecordDelete,
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
