<template>
  <UModal
    title="存款帳戶資料設定"
    description="資料內容"
    v-model:open="openCurrencyAccountsData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.currencyAccountIdGot">
      <ui-buttonGroup showView :viewText="'檢視存款帳戶'" />
      <ui-buttonGroup showRemove :removeText="'刪除存款帳戶'" @dataRemove="removeCurrencyAccountData()" />
    </template>
    <template v-if="!props.currencyAccountIdGot">
      <ui-buttonGroup showCreate :createText="'新增存款帳戶'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>存款帳戶號碼：</span>
            <UInput
              :class="['col-span-3', dataValidate.accountId ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.accountId"
              :disabled="props.currencyAccountIdGot ? true : false" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.accountId">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請填寫存款帳戶號碼</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>存款帳戶名稱：</span>
            <UInput
              :class="['col-span-3', dataValidate.accountName ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.accountName" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.accountName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請填寫存款帳戶名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">銀行代碼：</span>
            <UInput class="col-span-1" v-model="dataParams.accountBankCode" />
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">銀行名稱：</span>
            <UInput class="col-span-3" v-model="dataParams.accountBankName" />
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>結算貨幣：</span>
            <div :class="['w-fit', dataValidate.currency ? '' : 'outline-1 outline-red-500']">
              <dataBaseCurrencySelect
                :currencyIdGot="dataParams.currency"
                :isDisable="props.currencyAccountIdGot ? true : false"
                @sendbackCurrencyData="settingCurrency" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currency">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇結算貨幣</span>
          </div>
        </div>

        <template v-if="props.currencyAccountIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">目前金額：</span>
            <UInput class="col-span-3" :value="currencyFormat(dataParams.presentAmount)" disabled />
          </div>
        </template>
        <template v-else>
          <div class="w-full">
            <div class="flex justify-start items-center grid grid-cols-6">
              <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
              <UInputNumber
                :class="['col-span-3', dataValidate.startingAmount ? '' : 'outline-1 outline-red-500']"
                v-model="dataParams.startingAmount"
                orientation="vertical" />
            </div>
            <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.startingAmount">
              <span class="col-span-2 text-right"></span>
              <span class="col-span-4 text-red-500 mx-2">{{ startingAmountValidateText }}</span>
            </div>
          </div>
        </template>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>最小允許金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.minimumValueAllowed ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.minimumValueAllowed"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.minimumValueAllowed">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ minimumValueAllowedValidateText }}</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.alertValue ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.alertValue"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.alertValue">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ alertValueValidateText }}</span>
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">提醒：</span>
          <USwitch v-model="dataParams.openAlert" />
          <div class="flex justify-start items-center col-span-3">
            <UCheckbox label="薪資帳戶" v-model="dataParams.isSalaryAccount" size="xl" />
          </div>
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-3" v-model="dataParams.note" />
        </div>

        <template v-if="props.currencyAccountIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">建立時間：</span>
            <UInput class="col-span-3" :value="yearMonthDayTimeFormat(dataParams.createdDate)" disabled />
          </div>
        </template>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="currencyAccountDataHandling" />
          <ui-buttonGroup showClose @dataClose="openCurrencyAccountsData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchCurrencyAccountById,
  fetchCurrencyAccountCreate,
  fetchCurrencyAccountUpdate,
  fetchCurrencyAccountDelete,
} from "@/server/currencyAccountApi";
import { ICurrencyAccountList, ICurrencyList, IResponse } from "@/models/index";
import { currencyFormat, yearMonthDayTimeFormat, dataObjectValidate } from "@/composables/tools";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog";

const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));

const props = withDefaults(defineProps<{ currencyAccountIdGot?: string }>(), { currencyAccountIdGot: "" });
const emits = defineEmits(["dataReseaching"]);

const openCurrencyAccountsData = ref<boolean>(false);
const getDefaultDataParams = (): ICurrencyAccountList => ({
  accountId: props.currencyAccountIdGot || "",
  userId: "",
  accountType: "currencyAccount",
  accountName: "",
  accountBankCode: "",
  accountBankName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  isSalaryAccount: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<ICurrencyAccountList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  accountId: true,
  accountName: true,
  currency: true,
  startingAmount: true,
  minimumValueAllowed: true,
  alertValue: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());
const startingAmountValidateText = ref<string>("");
const minimumValueAllowedValidateText = ref<string>("");
const alertValueValidateText = ref<string>("");

watch(openCurrencyAccountsData, () => {
  if (openCurrencyAccountsData.value === true) {
    if (props.currencyAccountIdGot) {
      searchingCurrencyAccountData();
    }
  } else if (openCurrencyAccountsData.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingCurrencyAccountData() {
  try {
    const res: IResponse = await fetchCurrencyAccountById(props.currencyAccountIdGot);
    Object.assign(dataParams, res.data.data);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

function settingCurrency(currencyData: ICurrencyList) {
  dataParams.currency = currencyData.currencyCode;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultDataValidate());

  if (!dataParams.accountId) {
    dataValidate.accountId = false;
  }
  if (!dataParams.accountName) {
    dataValidate.accountName = false;
  }
  if (!dataParams.currency) {
    dataValidate.currency = false;
  }
  if (
    typeof dataParams.startingAmount !== "number" ||
    !isFinite(dataParams.startingAmount) ||
    dataParams.startingAmount < 0
  ) {
    dataValidate.startingAmount = false;
    startingAmountValidateText.value = "請填寫帳戶初始金額";
  }
  if (
    typeof dataParams.minimumValueAllowed !== "number" ||
    !isFinite(dataParams.minimumValueAllowed) ||
    dataParams.minimumValueAllowed < 0
  ) {
    dataValidate.minimumValueAllowed = false;
    minimumValueAllowedValidateText.value = "請填寫帳戶最小允許金額";
  }
  if (dataParams.minimumValueAllowed < dataParams.startingAmount) {
    dataValidate.minimumValueAllowed = false;
    minimumValueAllowedValidateText.value = "最小允許金額不得小於帳戶初始金額";
  }
  if (dataParams.alertValue < dataParams.minimumValueAllowed) {
    dataValidate.alertValue = false;
    alertValueValidateText.value = "提醒金額不得低於最小允許金額";
  }
  if (typeof dataParams.alertValue !== "number" || !isFinite(dataParams.alertValue) || dataParams.alertValue < 0) {
    dataValidate.alertValue = false;
    alertValueValidateText.value = "請填寫提醒金額";
  }

  return dataObjectValidate(dataValidate);
}

async function currencyAccountDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.currencyAccountIdGot ? fetchCurrencyAccountUpdate : fetchCurrencyAccountCreate)(
      dataParams,
    );
    messageToast({ message: res.data.message });
    openCurrencyAccountsData.value = false;
    emits("dataReseaching");
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function removeCurrencyAccountData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除存款帳戶資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCurrencyAccountDelete,
    apiParams: props.currencyAccountIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
    openCurrencyAccountsData.value = false;
  }
}
</script>
<style lang="scss" scoped></style>
