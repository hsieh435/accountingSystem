<template>
  <UModal
    title="儲值票卡收支紀錄"
    description="資料內容"
    v-model:open="openTradeData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視儲值票卡收支'" />
      <ui-buttonGroup :showRemove="props.isEditable" :removeText="'刪除儲值票卡收支'" @dataRemove="deleteTradeRecord" />
    </template>
    <template v-if="!props.tradeIdGot">
      <ui-buttonGroup showCreate :createText="'新增儲值票卡收支'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>儲值票卡：</span>
            <div :class="['w-fit', dataValidate.storedValueCardId ? '' : 'outline-1 outline-red-500']">
              <accountSelect
                selectTargetId="isStoredvaluecardAble"
                :accountIdGot="dataParams.storedValueCardId"
                :sellectAll="false"
                :isDisable="props.tradeIdGot ? true : false"
                @sendbackAccount="settingStoredValueCardAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.storedValueCardId">
            <span class="col-start-3 col-span-4 text-red-500">請選擇儲值票卡</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
            <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
              <dateTimeSelect
                :dateTimeGot="dataParams.tradeDatetime"
                :isDisabled="!props.isEditable"
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
                :transactionType="dataParams.transactionType"
                :isDisabled="!props.isEditable"
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
                accountType="isStoredvaluecardAble"
                :tradeCategoryGot="dataParams.tradeCategory"
                :isEditable="props.isEditable"
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
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">票卡餘額：</span>
            <UInput class="col-span-3" :value="currencyFormat(oriRemainingAmount)" disabled />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect :currencyIdGot="dataParams.currency" isDisable @sendbackCurrencyData="settingCurrency" />
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
          <ui-buttonGroup showSave @dataSave="storedValueCardRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="openTradeData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchStoredValueCardRecordById,
  fetchStoredValueCardRecordCreate,
  fetchStoredValueCardRecordUpdate,
  fetchStoredValueCardRecordDelete,
} from "@/server/storedValueCardRecordApi.ts";
import { IStoredValueCardRecordList, IStoredValueCardList, ICurrencyList, IResponse } from "@/models/index.ts";
import {
  getDefaultTradeValidate,
  getDefaultStoredValueCard,
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

const props = withDefaults(
  defineProps<{ tradeIdGot?: string; storedValueCardIdGot?: string; isEditable?: boolean }>(),
  {
    tradeIdGot: "",
    storedValueCardIdGot: "",
    isEditable: false,
  },
);
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): IStoredValueCardRecordList => ({
  tradeId: props.tradeIdGot || "",
  storedValueCardId: props.storedValueCardIdGot || "",
  storedValueCardData: getDefaultStoredValueCard(),
  accountType: "",
  tradeDatetime: "",
  transactionType: "",
  transactionCategoryData: getDefaultTransactionCategory(),
  tradeCategory: "",
  tradeCategoryData: getDefaultTradeCategory(),
  tradeAmount: 0,
  remainingAmount: 0,
  currency: "",
  currencyData: getDefaultCurrency(),
  tradeDescription: "",
  tradeNote: "",
  createdDatetime: "",
  editedDatetime: "",
});
const dataParams = reactive<IStoredValueCardRecordList>(getDefaultDataParams());
const storedValueCardChosen = ref<IStoredValueCardList>(getDefaultStoredValueCard());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const setStep = ref<number>(1);
const oriTradeAmount = ref<number>(0);
const oriRemainingAmount = ref<number>(0);
const oriTransactionType = ref<string>("");
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(storedValueCardChosen, getDefaultStoredValueCard());
    Object.assign(dataValidate, getDefaultTradeValidate());
    setStep.value = 1;
    oriTradeAmount.value = 0;
    oriRemainingAmount.value = 0;
    oriTransactionType.value = "";
    tradeAmountValidateText.value = "";
    if (props.tradeIdGot) {
      searchingStoredValueCardRecord();
    }
  }
});

async function searchingStoredValueCardRecord() {
  try {
    const res: IResponse = await fetchStoredValueCardRecordById({
      storedValueCardId: props.storedValueCardIdGot,
      tradeId: props.tradeIdGot,
    });
    // console.log("res:", res.data.data);
    Object.assign(dataParams, res.data.data);
    oriTradeAmount.value = res.data.data.tradeAmount;
    oriTransactionType.value = res.data.data.transactionType;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function settingStoredValueCardAccount(account: IStoredValueCardList | null) {
  storedValueCardChosen.value = account || getDefaultStoredValueCard();
  dataParams.storedValueCardId = storedValueCardChosen.value.storedValueCardId;
  dataParams.currency = storedValueCardChosen.value.currency;
  // console.log("storedValueCardChosen:", storedValueCardChosen.value);
  await settingRemainingAmount();

  if (
    openTradeData.value === true &&
    storedValueCardChosen.value.storedValueCardId.length > 0 &&
    storedValueCardChosen.value.openAlert === true &&
    oriRemainingAmount.value < storedValueCardChosen.value.alertValue
  ) {
    messageToast({
      message: `票卡餘額已低於 ${currencyFormat(storedValueCardChosen.value.alertValue)} 元`,
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

  oriRemainingAmount.value = storedValueCardChosen.value.presentAmount;
  if (dataParams.storedValueCardId.length > 0 && dataParams.transactionType === "income") {
    oriRemainingAmount.value = storedValueCardChosen.value.presentAmount - oriTradeAmount.value + dataParams.tradeAmount;
    if (oriTransactionType.value === "expense") {
      oriRemainingAmount.value = oriRemainingAmount.value + oriTradeAmount.value * 2;
    }
  } else if (dataParams.storedValueCardId.length > 0 && dataParams.transactionType === "expense") {
    oriRemainingAmount.value = storedValueCardChosen.value.presentAmount + oriTradeAmount.value - dataParams.tradeAmount;
    if (oriTransactionType.value === "income") {
      oriRemainingAmount.value = oriRemainingAmount.value - oriTradeAmount.value * 2;
    }
  } else if (!dataParams.storedValueCardId || !dataParams.transactionType) {
    oriRemainingAmount.value = 0;
  }

  if (
    openTradeData.value === true &&
    storedValueCardChosen.value.storedValueCardId.length > 0 &&
    oriRemainingAmount.value < storedValueCardChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `票卡最低允許值為：${currencyFormat(storedValueCardChosen.value.minimumValueAllowed)}`;
  } else {
    dataValidate.tradeAmount = true;
    tradeAmountValidateText.value = "";
  }
}

async function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.storedValueCardId) {
    dataValidate.storedValueCardId = false;
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
    tradeAmountValidateText.value = "交易金額不得為負";
  }

  return dataObjectValidate(dataValidate);
}

async function storedValueCardRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (
      props.tradeIdGot ? fetchStoredValueCardRecordUpdate : fetchStoredValueCardRecordCreate
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
    message: "即將刪除票卡記錄",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchStoredValueCardRecordDelete,
    apiParams: {
      tradeId: props.tradeIdGot,
      storedValueCardId: props.storedValueCardIdGot,
    },
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
