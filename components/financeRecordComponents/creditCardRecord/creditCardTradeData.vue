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

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.tradeAmount ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.updateData.tradeAmount"
              orientation="vertical"
              :min="0"
              :step="setStep" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-start-3 col-span-4 text-red-500">交易金額不得為負</span>
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
          <ui-buttonGroup showSave @dataSave="creditCardRecordDataHandling" />
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
} from "@/server/creditCardRecordApi";
import { ICreditCardRecordData, ICreditCardList, ICurrencyList, IResponse } from "@/models/index";
import { dataObjectValidate } from "@/composables/tools";
import { messageToast } from "@/composables/swalDialog";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; creditCardIdGot?: string }>(), {
  tradeIdGot: "",
  creditCardIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const openTradeData = ref<boolean>(false);
const getDefaultDataParams = (): ICreditCardRecordData => ({
  updateData: {
    tradeId: props.tradeIdGot || "",
    creditCardId: props.creditCardIdGot,
    tradeDatetime: "",
    userId: "",
    accountType: "",
    tradeCategory: "",
    tradeAmount: 0,
    currency: "",
    billMonth: "",
    remainingAmount: 0,
    tradeDescription: "",
    tradeNote: "",
  },
  oriData: {
    oriTradeDatetime: "",
    oriTradeAmount: 0,
    oriRemainingAmount: 0,
  },
});
const dataParams = reactive<ICreditCardRecordData>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  creditCardId: true,
  tradeDatetime: true,
  tradeCategory: true,
  tradeAmount: true,
});
const setStep = ref<number>(1);
const dataValidate = reactive<any>(getDefaultDataValidate());

watch(openTradeData, () => {
  if (openTradeData.value === true) {
    if (props.tradeIdGot) {
      searchingCreditCardRecord();
    }
  } else if (openTradeData.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingCreditCardRecord() {
  try {
    const res: IResponse = await fetchCreditCardRecordById({
      creditCardId: props.creditCardIdGot,
      tradeId: props.tradeIdGot,
    });
    Object.assign(dataParams, res.data.data[0]);
    dataParams.oriData.oriTradeDatetime = res.data.data[0].tradeDatetime;
    dataParams.oriData.oriTradeAmount = res.data.data[0].tradeAmount;
    dataParams.oriData.oriRemainingAmount = res.data.data[0].remainingAmount;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

function settingCreditCardAccount(account: ICreditCardList[]) {
  dataParams.updateData.creditCardId = account[0].creditcardId || "";
  dataParams.updateData.currency = account[0].currency || "";
}

function settingTradeDatetime(dateTime: string) {
  dataParams.updateData.tradeDatetime = dateTime;
  dataParams.updateData.billMonth = dateTime ? new Date(dateTime).toISOString().slice(0, 7) + "-01" : "";
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.updateData.tradeCategory = tradeCategoryId;
}

function settingCurrency(currencyData: ICurrencyList) {
  setStep.value = currencyData.minimumDenomination;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultDataValidate());

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
    openTradeData.value = false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
