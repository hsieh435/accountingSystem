<template>
  <UModal
    title="銀行帳戶收支紀錄"
    description="資料內容"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeIdGot">
      <ui-buttonGroup showView :viewText="'檢視銀行帳戶收支'" />
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
              :isDisable="props.tradeIdGot ? true : false"
              @sendbackAccount="settingAccount" />
          </div>
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.accountId">
          <span class="col-span-2 text-right"></span>
          <span class="col-span-4 text-red-500 mx-2">請選擇存款帳戶</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易時間：</span>
          <div :class="['w-fit', dataValidate.tradeDatetime ? '' : 'outline-1 outline-red-500']">
            <dateTimeSelect :dateTimeGot="dataParams.tradeDatetime" @sendbackDateTime="settingTradeDatetime" />
          </div>
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeDatetime">
          <span class="col-span-2 text-right"></span>
          <span class="col-span-4 text-red-500 mx-2">請填寫交易時間</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
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

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>收支項目：</span>
          <div :class="['w-fit', dataValidate.tradeCategory ? '' : 'outline-1 outline-red-500']">
            <tradeCategorySelect
              accountType="isCuaccountAble"
              :tradeCategoryGot="dataParams.tradeCategory"
              @sendbackTradeCategory="settingTradeCategory" />
          </div>
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCategory">
          <span class="col-span-2 text-right"></span>
          <span class="col-span-4 text-red-500 mx-2">請選擇收支項目</span>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易金額：</span>
          <UInputNumber
            :class="['col-span-3', dataValidate.tradeAmount ? '' : 'outline-1 outline-red-500']"
            v-model="dataParams.tradeAmount"
            orientation="vertical"
            @change="settingRemainingAmount()" />
        </div>
        <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeAmount">
          <span class="col-span-2 text-right"></span>
          <span class="col-span-4 text-red-500 mx-2">交易金額不得為負</span>
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
          <ui-buttonGroup showSave @dataSave="currencyAccountRecordDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
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
} from "@/server/currencyAccountRecordApi";
import { IcurrencyAccountRecordList, ICurrencyAccountList, IResponse } from "@/models/index";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

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

const open = ref<boolean>(false);
const getDefaultDataParams = (): IcurrencyAccountRecordList => ({
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
});
const dataParams = reactive<IcurrencyAccountRecordList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  accountId: true,
  tradeDatetime: true,
  transactionType: true,
  tradeCategory: true,
  tradeAmount: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());
const originalRemainingAmount = ref<number>(0);
const originalTradeAmount = ref<number>(0);
const originalTradeDatetime = ref<string>("");
const storedValueCardChosen = ref<ICurrencyAccountList>({} as ICurrencyAccountList);

watch(open, () => {
  if (open.value === true) {
    if (props.tradeIdGot) {
      searchingCurrencyAccountRecord();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
    Object.assign(storedValueCardChosen, {} as ICurrencyAccountList);
    originalTradeDatetime.value = "";
    originalRemainingAmount.value = 0;
    originalTradeAmount.value = 0;
  }
});

async function searchingCurrencyAccountRecord() {
  try {
    const res: IResponse = await fetchCurrencyAccountRecordById({
      accountId: props.accountIdGot,
      tradeId: props.tradeIdGot,
    });
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
      messageToast({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

function settingAccount(account: ICurrencyAccountList[]) {
  if (account && account.length > 0) {
    dataParams.accountId = account[0].accountId || "";
    dataParams.currency = account[0].currency || "";
    dataParams.remainingAmount = account[0].presentAmount;
    storedValueCardChosen.value = account[0];
    settingRemainingAmount();
  } else {
    dataParams.accountId = "";
    dataParams.currency = "";
    dataParams.remainingAmount = 0;
    storedValueCardChosen.value = {} as ICurrencyAccountList;
  }
}

function settingTradeDatetime(dateTime: string) {
  dataParams.tradeDatetime = dateTime;
}

function settingTransactionType(type: string) {
  dataParams.transactionType = type;
  if (dataParams.accountId) {
    settingRemainingAmount();
  }
}

async function settingRemainingAmount() {
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
    messageToast({ message: `現金流餘額低於警示值 ${storedValueCardChosen.value.alertValue}`, icon: "warning" });
  }
  if (
    storedValueCardChosen.value &&
    storedValueCardChosen.value.openAlert === true &&
    dataParams.remainingAmount < storedValueCardChosen.value.minimumValueAllowed
  ) {
    dataValidate.tradeAmount = false;
    // tradeAmountValidateText.value = `現金流最低允許值為：${storedValueCardChosen.value.minimumValueAllowed}`;
  }
}

function settingTradeCategory(tradeCategoryId: string) {
  dataParams.tradeCategory = tradeCategoryId;
}

async function validateData() {
  dataValidate.accountId = true;
  dataValidate.tradeDatetime = true;
  dataValidate.transactionType = true;
  dataValidate.tradeCategory = true;
  dataValidate.tradeAmount = true;

  if (!dataParams.accountId) {
    dataValidate.accountId = false;
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
  if (typeof dataParams.tradeAmount !== "number" || !isFinite(dataParams.tradeAmount) || dataParams.tradeAmount < 0) {
    dataValidate.tradeAmount = false;
    // tradeAmountValidateText.value = "交易金額不得為負";
  }

  if (
    !dataValidate.accountId ||
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

async function currencyAccountRecordDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (
      props.tradeIdGot ? fetchCurrencyAccountRecordUpdate : fetchCurrencyAccountRecordCreate
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
