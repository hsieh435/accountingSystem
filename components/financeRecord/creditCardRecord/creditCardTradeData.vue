<template>
  <UModal
    title="信用卡花費紀錄"
    description="資料內容"
    v-model:open="openTradeData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視信用卡花費'" />
      <ui-buttonGroup :showRemove="props.isEditable" :removeText="'刪除信用卡花費'" @dataRemove="deleteTradeRecord" />
    </template>
    <template v-if="!props.tradeIdGot">
      <ui-buttonGroup showCreate :createText="'新增信用卡花費'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>信用卡：</span>
            <div :class="['w-fit', dataValidate.creditCardId ? '' : 'outline-1 outline-red-500']">
              <accountSelect
                selectTargetId="isCreditcardAble"
                :accountIdGot="dataParams.updateData.creditCardId"
                :sellectAll="false"
                :isDisable="props.tradeIdGot ? true : false"
                @sendbackAccount="settingCreditCardAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.creditCardId">
            <span class="col-start-3 col-span-4 text-red-500">請選擇信用卡</span>
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
            <span class="col-start-3 col-span-4 text-red-500">請填寫交易時間</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isCreditcardAble"
                :tradeCategoryGot="dataParams.updateData.tradeCategory"
                @sendbackTradeCategory="settingTradeCategory" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCategory">
            <span class="col-start-3 col-span-4 text-red-500">請選擇收支項目</span>
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

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.tradeAmount ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.tradeAmount"
              orientation="vertical"
              :min="0"
              :step="setStep"
              @change="settingUsageAlert" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-start-3 col-span-4 text-red-500">{{ tradeAmountValidateText }}</span>
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
          <ui-buttonGroup :showSave="props.isEditable" @dataSave="creditCardRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="openTradeData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchCreditCardRecordById,
  fetchCreditCardRecordCreate,
  fetchCreditCardRecordUpdate,
  fetchCreditCardRecordDelete,
} from "@/server/creditCardRecordApi.ts";
import { fetchCreditCardLimit } from "@/server/creditCardApi.ts";
import { fetchCreditCardMonthExpenditure } from "@/server/creditCardApi.ts";
import { ICreditCardRecordData, ICreditCardList, ICurrencyList, IResponse } from "@/models/index.ts";
import {
  getDefaultTradeValidate,
  getDefaultCreditCard,
  getDefaultCurrency,
  getDefaultTradeCategory,
} from "@/components/tradeParamsTools.ts";
import { yearMonthFormat, dataObjectValidate } from "@/composables/tools.ts";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog.ts";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; creditCardIdGot?: string; isEditable?: boolean }>(), {
  tradeIdGot: "",
  creditCardIdGot: "",
  isEditable: true,
});
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): ICreditCardRecordData => ({
  updateData: {
    tradeId: props.tradeIdGot || "",
    creditCardId: props.creditCardIdGot || "",
    creditcardData: getDefaultCreditCard(),
    tradeDatetime: "",
    userId: "",
    accountType: "",
    tradeCategory: "",
    tradeCategoryData: getDefaultTradeCategory(),
    tradeAmount: 0,
    currency: "",
    currencyData: getDefaultCurrency(),
    billMonth: "",
    remainingAmount: 0,
    tradeDescription: "",
    tradeNote: "",
    createdDatetime: "",
    editedDatetime: "",
  },
  oriData: {
    oriTradeDatetime: "",
    oriTradeAmount: 0,
    oriCreditUsage: 0,
  },
});
const dataParams = reactive<ICreditCardRecordData>(getDefaultDataParams());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultTradeValidate());
const creditCardChosen = ref<ICreditCardList>(getDefaultCreditCard());
const spendCalculation = ref<number>(0);
const limitCurrentMonth = ref<number>(0);
const setStep = ref<number>(1);
const tradeAmountValidateText = ref<string>("");

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultTradeValidate());
    Object.assign(creditCardChosen, getDefaultCreditCard());
    tradeAmountValidateText.value = "";
    if (props.tradeIdGot) {
      searchingCreditCardRecord();
    }
  }
});

async function creditcardmonthlyexpenditure() {
  try {
    const res: IResponse = await fetchCreditCardMonthExpenditure({
      creditcardId: dataParams.updateData.creditCardId || "",
      tradeDatetime: dataParams.updateData.billMonth || "",
    });
    console.log("res:", res.data.data.tradeTotal);
    spendCalculation.value = res.data.data.tradeTotal || 0;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function searchingCreditCardRecord() {
  try {
    const res: IResponse = await fetchCreditCardRecordById({
      creditCardId: props.creditCardIdGot,
      tradeId: props.tradeIdGot,
    });
    console.log("fetchCreditCardRecordById:", res.data.data);
    Object.assign(dataParams, res.data.data);
    dataParams.oriData.oriTradeDatetime = res.data.data.tradeDatetime;
    dataParams.oriData.oriTradeAmount = res.data.data.tradeAmount;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function searchingcreditcardlimit() {
  try {
    const res: IResponse = await fetchCreditCardLimit({
      creditcardId: dataParams.updateData.creditCardId,
      yearMonth: yearMonthFormat(dataParams.updateData.tradeDatetime),
    });
    // console.log("res:", res.data.data);
    limitCurrentMonth.value = res.data.data[0].limitCredit || 0;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function settingCreditCardAccount(account: ICreditCardList | null) {
  creditCardChosen.value = account || getDefaultCreditCard();
  dataParams.updateData.creditCardId = creditCardChosen.value.creditcardId || getDefaultCreditCard().creditcardId;
  dataParams.updateData.currency = creditCardChosen.value.currency || "";
  await searchingcreditcardlimit();
  await settingUsageAlert();
}

async function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
  dataParams.updateData.billMonth = dateTime ? new Date(dateTime).toISOString().slice(0, 7) + "-01" : "";
  await searchingcreditcardlimit();
  await settingUsageAlert();
}

async function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

async function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function settingUsageAlert() {
  // getCurrentYear() === getCurrentYear(dataParams.updateData.tradeDatetime) &&
  // getCurrentMonth() === getCurrentMonth(dataParams.updateData.tradeDatetime)
  if (creditCardChosen.value.openAlert === true) {
    await creditcardmonthlyexpenditure();
    messageToast({
      message: `警示金額 ${creditCardChosen.value.alertValue} 元，本月已花費 ${spendCalculation.value + dataParams.updateData.tradeAmount} 元`,
      icon: "warning",
    });
  }
}

async function validateData() {
  Object.assign(dataValidate, getDefaultTradeValidate());

  if (!dataParams.updateData.creditCardId) {
    dataValidate.creditCardId = false;
  }
  if (!dataParams.updateData.tradeDatetime) {
    dataValidate.tradeDatetime = false;
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
    tradeAmountValidateText.value = "確實填寫交易金額";
  }
  if (spendCalculation.value + dataParams.updateData.tradeAmount > limitCurrentMonth.value) {
    dataValidate.tradeAmount = false;
    tradeAmountValidateText.value = "本月交易金額超過信用額度";
  }

  return dataObjectValidate(dataValidate);
}

async function creditCardRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeIdGot ? fetchCreditCardRecordUpdate : fetchCreditCardRecordCreate)(
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
    message: "即將刪除信用卡記錄",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCreditCardRecordDelete,
    apiParams: {
      tradeId: props.tradeIdGot,
      creditCardId: props.creditCardIdGot,
    },
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
