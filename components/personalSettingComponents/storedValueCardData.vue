<template>
  <UModal
    title="儲值票卡資料設定"
    description="資料內容"
    v-model:open="openStoredValueCardData"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.storedValueCardIdGot">
      <ui-buttonGroup showView :viewText="'檢視儲值票卡'" />
      <ui-buttonGroup showRemove :removeText="'刪除儲值票卡'" @dataRemove="removeStoredValueCardData()" />
    </template>
    <template v-if="!props.storedValueCardIdGot">
      <ui-buttonGroup showCreate :createText="'新增儲值票卡'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>儲值票卡名稱：</span>
            <UInput
              :class="['col-span-3', dataValidate.storedValueCardName ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.storedValueCardName" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.storedValueCardName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請填寫儲值票卡名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>結算貨幣：</span>
            <div :class="['w-fit', dataValidate.currency ? '' : 'outline-1 outline-red-500']">
              <dataBaseCurrencySelect
                :currencyIdGot="dataParams.currency"
                :isDisable="props.storedValueCardIdGot ? true : false"
                @sendbackCurrencyData="settingCurrency" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currency">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇票卡結算貨幣</span>
          </div>
        </div>

        <template v-if="props.storedValueCardIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">目前金額：</span>
            <UInputNumber class="col-span-3" v-model="dataParams.presentAmount" orientation="vertical" disabled />
          </div>
        </template>
        <template v-else>
          <div class="w-full">
            <div class="flex justify-start items-center grid grid-cols-6">
              <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
              <UInputNumber
                :class="['col-span-3', dataValidate.startingAmount ? '' : 'outline-1 outline-red-500']"
                v-model="dataParams.startingAmount"
                orientation="vertical"
                :disabled="props.storedValueCardIdGot ? true : false" />
            </div>
            <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.startingAmount">
              <span class="col-span-2 text-right"></span>
              <span class="col-span-4 text-red-500 mx-2">{{ startingAmountValidateText }}</span>
            </div>
          </div>
        </template>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>最小儲值金額：</span>
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
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>最大儲值金額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.maximumValueAllowed ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.maximumValueAllowed"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.maximumValueAllowed">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">{{ maximumValueAllowedValidateText }}</span>
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
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <UTextarea class="col-span-3" v-model="dataParams.note" />
        </div>

        <template v-if="props.storedValueCardIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">建立時間：</span>
            <UInput class="col-span-3" :value="yearMonthDayTimeFormat(dataParams.createdDate)" disabled />
          </div>
        </template>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="storedValueCardDataHandling" />
          <ui-buttonGroup showClose @dataClose="openStoredValueCardData = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import {
  fetchStoredValueCardById,
  fetchStoredValueCardCreate,
  fetchStoredValueCardUpdate,
  fetchStoredValueCardDelete,
} from "@/server/storedValueCardApi.ts";
import { IStoredValueCardList, ICurrencyList, IResponse } from "@/models/index.ts";
import { getDefaultAccountDataValidate } from "@/components/personalSettingComponents/accountDataTools.ts";
import { yearMonthDayTimeFormat, dataObjectValidate } from "@/composables/tools.ts";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog.ts";

const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));

const props = withDefaults(defineProps<{ storedValueCardIdGot?: string }>(), { storedValueCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);

const openStoredValueCardData = ref<boolean>(false);
const getDefaultDataParams = (): IStoredValueCardList => ({
  storedValueCardId: props.storedValueCardIdGot || "",
  userId: "",
  accountType: "storedValueCard",
  storedValueCardName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  maximumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<IStoredValueCardList>(getDefaultDataParams());
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultAccountDataValidate());
const startingAmountValidateText = ref<string>("");
const minimumValueAllowedValidateText = ref<string>("");
const maximumValueAllowedValidateText = ref<string>("");
const alertValueValidateText = ref<string>("");

watch(openStoredValueCardData, () => {
  if (openStoredValueCardData.value === true) {
    if (props.storedValueCardIdGot) {
      searchingStoredValueCardData();
    }
  } else if (openStoredValueCardData.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultAccountDataValidate());
  }
});

async function searchingStoredValueCardData() {
  try {
    const res: IResponse = await fetchStoredValueCardById(props.storedValueCardIdGot);
    Object.assign(dataParams, res.data.data);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

function settingCurrency(currencyData: ICurrencyList) {
  dataParams.currency = currencyData.currencyCode;
}

async function validateData() {
  Object.assign(dataValidate, getDefaultAccountDataValidate());

  if (!dataParams.storedValueCardName) {
    dataValidate.storedValueCardName = false;
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
    startingAmountValidateText.value = "請填寫儲值票卡初始金額";
  }
  if (
    typeof dataParams.minimumValueAllowed !== "number" ||
    !isFinite(dataParams.minimumValueAllowed) ||
    dataParams.minimumValueAllowed < 0
  ) {
    dataValidate.minimumValueAllowed = false;
    minimumValueAllowedValidateText.value = "請填寫儲值票卡最小儲值金額";
  }
  if (
    typeof dataParams.maximumValueAllowed !== "number" ||
    !isFinite(dataParams.maximumValueAllowed) ||
    dataParams.maximumValueAllowed <= 0
  ) {
    dataValidate.maximumValueAllowed = false;
    maximumValueAllowedValidateText.value = "請填寫儲值票卡最大儲值金額";
  }
  if (dataParams.maximumValueAllowed <= dataParams.minimumValueAllowed) {
    dataValidate.maximumValueAllowed = false;
    maximumValueAllowedValidateText.value = "儲值票卡最小儲值金額必須小於最大儲值金額";
  }
  if (typeof dataParams.alertValue !== "number" || !isFinite(dataParams.alertValue) || dataParams.alertValue < 0) {
    dataValidate.alertValue = false;
    alertValueValidateText.value = "請填寫提醒金額";
  }
  if (dataParams.minimumValueAllowed < dataParams.startingAmount) {
    dataValidate.minimumValueAllowed = false;
    minimumValueAllowedValidateText.value = "最小允許金額不得小於帳戶初始金額";
  }
  if (
    dataParams.alertValue < dataParams.minimumValueAllowed ||
    dataParams.alertValue > dataParams.maximumValueAllowed
  ) {
    dataValidate.alertValue = false;
    alertValueValidateText.value = "提醒金額需介於最小儲值金額與最大儲值金額之間";
  }

  return dataObjectValidate(dataValidate);
}

async function storedValueCardDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.storedValueCardIdGot ? fetchStoredValueCardUpdate : fetchStoredValueCardCreate)(
      dataParams,
    );
    messageToast({ message: res.data.message });
    emits("dataReseaching");
    openStoredValueCardData.value = false;
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function removeStoredValueCardData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除儲值票卡資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchStoredValueCardDelete,
    apiParams: props.storedValueCardIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
    openStoredValueCardData.value = false;
  }
}
</script>
<style lang="scss" scoped></style>
