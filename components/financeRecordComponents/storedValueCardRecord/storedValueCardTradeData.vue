<template>
  <UModal
    title="儲值票卡收支紀錄"
    description="資料內容"
    v-model:open="open"
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
              <dateTimeSelect :dateTimeGot="dataParams.tradeDatetime" @sendbackDateTime="settingTradeDatetime" />
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
              @change="settingRemainingAmount()" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-start-3 col-span-4 text-red-500">{{ tradeAmountValidateText }}</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">餘額：</span>
            <UInput class="col-span-3" :value="currencyFormat(dataParams.remainingAmount)" disabled />
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
          <UInput class="col-span-3" v-model="dataParams.tradeDescription" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-3" v-model="dataParams.tradeNote" />
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="storedValueCardRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
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
import { IStoredValueCardRecordList, IStoredValueCardList, ICurrencyList, IResponse } from "@/models/index";
import { currencyFormat } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

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

const open = ref<boolean>(false);
const getDefaultDataParams = (): IStoredValueCardRecordList => ({
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
});
const dataParams = reactive<IStoredValueCardRecordList>(getDefaultDataParams());
const originalRemainingAmount = ref<number>(0);
const originalTradeAmount = ref<number>(0);
const originalTradeDatetime = ref<string>("");
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

watch(open, () => {
  if (open.value === true) {
    if (props.tradeIdGot) {
      searchingStoredValueCardRecord();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
    Object.assign(storedValueCardChosen, {} as IStoredValueCardList);
    originalTradeDatetime.value = "";
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

function settingStoredValueCardAccount(account: IStoredValueCardList[]) {
  // console.log("account:", account);
  if (account && account.length > 0) {
    dataParams.storedValueCardId = account[0].storedValueCardId;
    dataParams.currency = account[0].currency;
    dataParams.remainingAmount = account[0].presentAmount;
    storedValueCardChosen.value = account[0] || ({} as IStoredValueCardList);
    settingRemainingAmount();
  } else {
    dataParams.storedValueCardId = "";
    dataParams.currency = "";
    dataParams.remainingAmount = 0;
    Object.assign(storedValueCardChosen, {} as IStoredValueCardList);
  }
}

function settingTradeDatetime(dateTime: string) {
  dataParams.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.transactionType = type;
  if (dataParams.storedValueCardId) {
    settingRemainingAmount();
  }
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
  // console.log("tradeAmount:", dataParams.tradeAmount, Number(dataParams.tradeAmount));
  // console.log("remainingAmount:", dataParams.remainingAmount, Number(dataParams.remainingAmount));
  console.log("storedValueCardChosen:", storedValueCardChosen.value);

  if (
    storedValueCardChosen.value &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.remainingAmount < storedValueCardChosen.value.alertValue
  ) {
    messageToast({
      message: `票卡餘額已低於 ${currencyFormat(storedValueCardChosen.value.alertValue)} 元`,
      icon: "warning"
    });
  }
  if (
    storedValueCardChosen.value &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.remainingAmount < storedValueCardChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = `現金流最低允許值為：${storedValueCardChosen.value.minimumValueAllowed}`;
  }
}

function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  dataValidate.storedValueCardId = !dataParams.storedValueCardId ? false : true;
  dataValidate.tradeDatetime = !dataParams.tradeDatetime ? false : true;
  dataValidate.transactionType = !dataParams.transactionType ? false : true;
  dataValidate.tradeCategory = !dataParams.tradeCategory ? false : true;
  if (typeof dataParams.tradeAmount !== "number" || !isFinite(dataParams.tradeAmount) || dataParams.tradeAmount < 0) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = "交易金額不得為負";
  }

  if (
    !dataValidate.storedValueCardId ||
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

async function storedValueCardRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (
      props.tradeIdGot ? fetchStoredValueCardRecordUpdate : fetchStoredValueCardRecordCreate
    )(dataParams);
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
