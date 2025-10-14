<template>
  <UModal
    title="信用卡花費紀錄"
    description="資料內容"
    v-model:open="open"
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
                :accountIdGot="dataParams.creditCardId"
                :sellectAll="false"
                :isDisable="props.tradeIdGot ? true : false"
                @sendbackAccount="settingCreditCardAccount" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.creditCardId">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇信用卡</span>
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
            <span class="col-span-4 text-red-500 mx-2">請填寫交易時間</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
            <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
              <tradeCategorySelect
                accountType="isCreditcardAble"
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
              v-model="dataParams.tradeAmount"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">交易金額不得為負</span>
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
          <ui-buttonGroup showSave @dataSave="creditCardRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
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
import { ICreditCardRecordList, ICreditCardList, IResponse } from "@/models/index";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateTimeSelect = defineAsyncComponent(() => import("@/components/ui/select/dateTimeSelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));

const props = withDefaults(defineProps<{ tradeIdGot?: string; creditCardIdGot?: string }>(), {
  tradeIdGot: "",
  creditCardIdGot: "",
});
const emits = defineEmits(["dataReseaching"]);

const open = ref<boolean>(false);
const getDefaultDataParams = (): ICreditCardRecordList => ({
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
});
const dataParams = reactive<ICreditCardRecordList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  creditCardId: true,
  tradeDatetime: true,
  tradeCategory: true,
  tradeAmount: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());

watch(open, () => {
  if (open.value === true) {
    if (props.tradeIdGot) {
      searchingCreditCardRecord();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
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
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      open.value = true;
    } else {
      messageToast({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

function settingCreditCardAccount(account: ICreditCardList[]) {
  dataParams.creditCardId = account[0].creditcardId || "";
  dataParams.currency = account[0].currency || "";
}

function settingTradeDatetime(dateTime: string) {
  dataParams.tradeDatetime = dateTime;
  dataParams.billMonth = dateTime ? new Date(dateTime).toISOString().slice(0, 7) + "-01" : "";
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.tradeCategory = tradeCategoryId;
}

async function validateData() {
  dataValidate.creditCardId = true;
  dataValidate.tradeDatetime = true;
  dataValidate.tradeCategory = true;
  dataValidate.tradeAmount = true;

  if (!dataParams.creditCardId) {
    dataValidate.creditCardId = false;
  }
  if (!dataParams.tradeDatetime) {
    dataValidate.tradeDatetime = false;
  }
  if (!dataParams.tradeCategory) {
    dataValidate.tradeCategory = false;
  }
  if (typeof dataParams.tradeAmount !== "number" || !isFinite(dataParams.tradeAmount) || dataParams.tradeAmount < 0) {
    dataValidate.tradeAmount = false;
  }

  if (
    !dataValidate.creditCardId ||
    !dataValidate.tradeDatetime ||
    !dataValidate.tradeCategory ||
    !dataValidate.tradeAmount
  ) {
    return false;
  } else {
    return true;
  }
}

async function creditCardRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeIdGot ? fetchCreditCardRecordUpdate : fetchCreditCardRecordCreate)(
      dataParams,
    );
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
