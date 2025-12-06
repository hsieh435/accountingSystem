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
              @change="settingRemainingAmount()" />
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
} from "@/server/storedValueCardRecordApi";
import { IStoredValueCardRecordData, IStoredValueCardList, ICurrencyList, IResponse } from "@/models/index";
import { currencyFormat, dataObjectValidate } from "@/composables/tools";
import { messageToast } from "@/composables/swalDialog";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const transactionTypeSelect = defineAsyncComponent(() => import("@/components/ui/select/transactionTypeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; storedValueCardIdGot?: string }>(), {
  tradeIdGot: "",
  storedValueCardIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): IStoredValueCardRecordData => ({
  updateData: {
    tradeId: props.tradeIdGot || "",
    storedValueCardId: props.storedValueCardIdGot || "",
    accountType: "",
    tradeDatetime: "",
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
    oriRemainingAmount: 0,
    oriTradeAmount: 0,
    oriTransactionType: "income",
  },
});
const dataParams = reactive<IStoredValueCardRecordData>(getDefaultDataParams());
const originalRemainingAmount = ref<number>(0);
const originalTradeAmount = ref<number>(0);
const getDefaultDataValidate = (): any => ({
  storedValueCardId: true,
  tradeDatetime: true,
  transactionType: true,
  tradeCategory: true,
  tradeAmount: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());
const storedValueCardChosen = ref<IStoredValueCardList>({} as IStoredValueCardList);
const setStep = ref<number>(1);
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    if (props.tradeIdGot) {
      searchingStoredValueCardRecord();
    }
  } else {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
    Object.assign(storedValueCardChosen, {} as IStoredValueCardList);
    originalRemainingAmount.value = 0;
    originalTradeAmount.value = 0;
    tradeAmountValidateText.value = "";
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
    dataParams.oriData.oriRemainingAmount = res.data.data.remainingAmount;
    dataParams.oriData.oriTransactionType = res.data.data.transactionType;
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

function settingStoredValueCardAccount(account: IStoredValueCardList[]) {
  console.log("account:", account);
  storedValueCardChosen.value = account[0] || ({} as IStoredValueCardList);
  dataParams.updateData.storedValueCardId = storedValueCardChosen.value.storedValueCardId;
  dataParams.updateData.currency = storedValueCardChosen.value.currency;
  dataParams.updateData.remainingAmount = storedValueCardChosen.value.presentAmount;
  if (props.tradeIdGot.length > 0 && account.length === 1) {
    if (dataParams.updateData.transactionType === "income") {
      originalRemainingAmount.value = storedValueCardChosen.value.presentAmount - originalTradeAmount.value;
    } else if (dataParams.updateData.transactionType === "expense") {
      originalRemainingAmount.value = storedValueCardChosen.value.presentAmount + originalTradeAmount.value;
    }
  }
  settingRemainingAmount();
}

function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.updateData.transactionType = type;
  if (dataParams.updateData.storedValueCardId) {
    settingRemainingAmount();
  }
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

function settingRemainingAmount() {
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
  console.log("storedValueCardChosen:", storedValueCardChosen.value);

  if (
    storedValueCardChosen.value &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.updateData.remainingAmount < storedValueCardChosen.value.alertValue
  ) {
    messageToast({
      message: `票卡餘額已低於 ${currencyFormat(storedValueCardChosen.value.alertValue)} 元`,
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

function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultDataValidate());

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
    openTradeData.value = false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
