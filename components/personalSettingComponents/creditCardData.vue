<template>
  <UModal
    title="信用卡資料設定"
    description="資料內容"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.creditCardIdGot">
      <ui-buttonGroup showView :viewText="'檢視信用卡'" />
      <ui-buttonGroup showRemove :removeText="'刪除信用卡'" @dataRemove="removeCreditcardData()" />
    </template>
    <template v-if="!props.creditCardIdGot">
      <ui-buttonGroup showCreate :createText="'新增信用卡'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>信用卡名稱：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses('col-span-3'),
                dataValidate.creditcardName ? '' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.creditcardName" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.creditcardName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入信用卡名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">發卡銀行代碼：</span>
            <input
              class="col-span-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1"
              v-model="dataParams.creditcardBankCode" />
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">發卡銀行：</span>
            <input :class="tailwindStyles.getInputClasses('col-span-3')" v-model="dataParams.creditcardBankName" />
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>發卡機構：</span>
            <div :class="['w-fit', dataValidate.creditcardSchema ? '' : 'outline-1 outline-red-500']">
              <creditCardSchemaSelect
                :selectId="dataParams.creditcardSchema"
                :sellectAll="false"
                :isAble="props.creditCardIdGot ? true : false"
                @sendbackSchemaId="settingCreditcardSchema" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.creditcardSchema">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇發卡機構</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>結算貨幣：</span>
            <div :class="['w-fit', dataValidate.currency ? '' : 'outline-1 outline-red-500']">
              <dataBaseCurrencySelect
                :currencyIdGot="dataParams.currency"
                :isDisable="props.creditCardIdGot ? true : false"
                @sendbackCurrencyId="settingCurrency" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currency">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇貨幣</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>信用額度：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.creditPerMonth ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.creditPerMonth"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.creditPerMonth">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ creditPerMonthValidateText }}</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6 mt-2">
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
          <div class="flex justify-start items-center grid grid-cols-6 mb-2">
            <span class="col-span-2 text-right"></span>
            <span class="col-start-3 col-end-6 text-left text-red-600">（ 每月消費額度累積提醒 ）</span>
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">提醒：</span>
          <div class="col-span-4 flex justify-start items-center">
            <switchComponent :switchValueGot="dataParams.openAlert" @sendBackSwitchValue="settingOpenAlert" />
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>到期年月：</span>
          <yearMonthComponent :yearMonthGot="dataParams.expirationDate" @sendbackYearMonth="settingExpirationDate" />
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <textarea :class="tailwindStyles.getInputClasses('col-span-3')" v-model="dataParams.note"></textarea>
        </div>

        <template v-if="props.creditCardIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">建立時間：</span>
            <input
              :class="tailwindStyles.getInputClasses('col-span-3')"
              :value="yearMonthDayTimeFormat(dataParams.createdDate)"
              disabled />
          </div>
        </template>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="creditCardDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchCreditCardById,
  fetchCreditCardCreate,
  fetchCreditCardUpdate,
  fetchCreditCardDelete,
} from "@/server/creditCardApi";
import { ICreditCardList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { messageToast, errorMessageDialog, showConfirmDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

const creditCardSchemaSelect = defineAsyncComponent(() => import("@/components/ui/select/creditCardSchemaSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const switchComponent = defineAsyncComponent(() => import("@/components/ui/switch.vue"));
const yearMonthComponent = defineAsyncComponent(() => import("@/components/ui/select/yearMonthSelect.vue"));

const props = withDefaults(defineProps<{ creditCardIdGot?: string }>(), { creditCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);

const open = ref<boolean>(false);
const getDefaultDataParams = (): ICreditCardList => ({
  creditcardId: props.creditCardIdGot || "",
  userId: "",
  accountType: "creditCard",
  creditcardName: "",
  creditcardBankCode: "",
  creditcardBankName: "",
  creditcardSchema: "",
  currency: "",
  creditPerMonth: 0,
  expirationDate: "",
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<ICreditCardList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  creditcardName: true,
  creditcardSchema: true,
  currency: true,
  creditPerMonth: true,
  alertValue: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());
const creditPerMonthValidateText = ref<string>("");
const alertValueValidateText = ref<string>("");

watch(open, () => {
  if (open.value === true) {
    if (props.creditCardIdGot) {
      searchingCreditCardData();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingCreditCardData() {
  try {
    const res: IResponse = await fetchCreditCardById(props.creditCardIdGot);
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

async function settingCreditcardSchema(schemaId: string) {
  dataParams.creditcardSchema = schemaId;
}

async function settingCurrency(currencyId: string) {
  dataParams.currency = currencyId;
}

async function settingOpenAlert(switchValue: boolean) {
  dataParams.openAlert = switchValue;
}

async function settingExpirationDate(year: number, month: number) {
  dataParams.expirationDate = `${year}-${month.toString().padStart(2, "0")}-01`;
}

async function validateData() {
  dataValidate.creditcardName = true;
  dataValidate.creditcardSchema = true;
  dataValidate.currency = true;
  dataValidate.creditPerMonth = true;
  dataValidate.alertValue = true;

  if (!dataParams.creditcardName) {
    dataValidate.creditcardName = false;
  }
  if (!dataParams.creditcardSchema) {
    dataValidate.creditcardSchema = false;
  }
  if (!dataParams.currency) {
    dataValidate.currency = false;
  }
  if (
    typeof dataParams.creditPerMonth !== "number" ||
    !isFinite(dataParams.creditPerMonth) ||
    dataParams.creditPerMonth <= 0
  ) {
    dataValidate.creditPerMonth = false;
    creditPerMonthValidateText.value = "請填寫信用卡信用額度";
  }
  if (typeof dataParams.alertValue !== "number" || !isFinite(dataParams.alertValue) || dataParams.alertValue < 0) {
    dataValidate.alertValue = false;
    alertValueValidateText.value = "請填寫提醒金額";
  }
  if (dataParams.alertValue > dataParams.creditPerMonth) {
    dataValidate.alertValue = false;
    alertValueValidateText.value = "提醒金額不得大於信用額度";
  }

  if (
    !dataValidate.creditcardName ||
    !dataValidate.creditcardSchema ||
    !dataValidate.currency ||
    !dataValidate.creditPerMonth ||
    !dataValidate.alertValue
  ) {
    return false;
  } else {
    return true;
  }
}

async function creditCardDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.creditCardIdGot ? fetchCreditCardUpdate : fetchCreditCardCreate)(dataParams);
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

async function removeCreditcardData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除信用卡資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCreditCardDelete,
    apiParams: props.creditCardIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
    open.value = false;
  }
}
</script>
<style lang="scss" scoped></style>
