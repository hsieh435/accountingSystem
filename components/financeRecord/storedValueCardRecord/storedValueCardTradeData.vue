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
      <ui-buttonGroup showRemove :removeText="'刪除儲值票卡收支'" @dataRemove="deleteTradeRecord" />
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
                :accountIdGot="dataParams.updateData.storedValueCardId"
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
                accountType="isStoredvaluecardAble"
                :tradeCategoryGot="dataParams.updateData.tradeCategory"
                :isDisable="!props.isEditable"
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
              :step="setStep"
              @update:modelValue="settingRemainingAmount()" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-start-3 col-span-4 text-red-500">{{ tradeAmountValidateText }}</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">票卡餘額：</span>
            <UInput class="col-span-3" :value="currencyFormat(dataParams.oriData.oriRemainingAmount)" disabled />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">貨幣：</span>
          <div class="w-fit">
            <dataBaseCurrencySelect
              :currencyIdGot="dataParams.updateData.currency"
              :isDisable="!props.isEditable"
              @sendbackCurrencyData="settingCurrency" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">說明：</span>
          <UInput class="col-span-3" v-model="dataParams.updateData.tradeDescription" :disabled="!props.isEditable" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-3" v-model="dataParams.updateData.tradeNote" :disabled="!props.isEditable" />
        </div>

        <div class="my-2">
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
import { IStoredValueCardRecordData, IStoredValueCardList, ICurrencyList, IResponse } from "@/models/index.ts";
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
const getDefaultDataParams = (): IStoredValueCardRecordData => ({
  updateData: {
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
  },
  oriData: {
    oriTradeDatetime: "",
    oriRemainingAmount: 0,
    oriTradeAmount: 0,
    oriTransactionType: "",
  },
});
const dataParams = reactive<IStoredValueCardRecordData>(getDefaultDataParams());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const storedValueCardChosen = ref<IStoredValueCardList>(getDefaultStoredValueCard());
const setStep = ref<number>(1);
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultTradeValidate());
    Object.assign(storedValueCardChosen, getDefaultStoredValueCard());
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
    Object.assign(dataParams.updateData, res.data.data);
    dataParams.oriData.oriTradeDatetime = res.data.data.tradeDatetime;
    dataParams.oriData.oriTradeAmount = res.data.data.tradeAmount;
    dataParams.oriData.oriTransactionType = res.data.data.transactionType;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function settingStoredValueCardAccount(account: IStoredValueCardList | null) {
  storedValueCardChosen.value = account || getDefaultStoredValueCard();
  dataParams.updateData.storedValueCardId = storedValueCardChosen.value.storedValueCardId;
  dataParams.updateData.currency = storedValueCardChosen.value.currency;
  dataParams.oriData.oriRemainingAmount = storedValueCardChosen.value.presentAmount;
  // console.log("storedValueCardChosen:", storedValueCardChosen.value);

  await settingRemainingAmount();
  if (
    openTradeData.value === true &&
    storedValueCardChosen.value.storedValueCardId.length > 0 &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.oriData.oriRemainingAmount < storedValueCardChosen.value.alertValue
  ) {
    messageToast({
      message: `票卡餘額已低於 ${currencyFormat(storedValueCardChosen.value.alertValue)} 元`,
      icon: "warning",
    });
  }
}

async function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
}

async function settingTransactionType(type: string) {
  dataParams.updateData.transactionType = type;
  if (dataParams.updateData.storedValueCardId.length > 0) {
    await settingRemainingAmount();
  }
}

async function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

async function settingRemainingAmount() {
  if (dataParams.updateData.transactionType === "income") {
    dataParams.oriData.oriRemainingAmount =
      storedValueCardChosen.value.presentAmount - dataParams.oriData.oriTradeAmount + dataParams.updateData.tradeAmount;
  } else if (dataParams.updateData.transactionType === "expense") {
    dataParams.oriData.oriRemainingAmount =
      storedValueCardChosen.value.presentAmount + dataParams.oriData.oriTradeAmount - dataParams.updateData.tradeAmount;
  } else {
    dataParams.oriData.oriRemainingAmount = dataParams.updateData.remainingAmount;
  }

  if (
    openTradeData.value === true &&
    storedValueCardChosen.value.storedValueCardId.length > 0 &&
    dataParams.oriData.oriRemainingAmount < storedValueCardChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `票卡最低允許值為：${currencyFormat(storedValueCardChosen.value.minimumValueAllowed)}`;
  } else {
    dataValidate.tradeAmount = true;
  }
}

async function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.updateData.storedValueCardId) {
    dataValidate.storedValueCardId = false;
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
