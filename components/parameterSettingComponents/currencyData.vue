<template>
  <UModal
    title="貨幣資料設定"
    description="資料內容"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.currencyCodeGot">
      <ui-buttonGroup showView :viewText="'檢視貨幣資料'" />
      <ui-buttonGroup showRemove :removeText="'刪除貨幣資料'" @dataRemove="removeCurrency()" />
    </template>
    <template v-if="!props.currencyCodeGot">
      <ui-buttonGroup showCreate :createText="'新增貨幣資料'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">貨幣代碼：</span>
            <UInput
              :class="['col-span-3', dataValidate.currencyCode ? 'outline-red-50' : 'outline-1 outline-red-500']"
              v-model="dataParams.currencyCode"
              :disabled="props.currencyCodeGot.length > 0"
              type="search" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currencyCode">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入貨幣代碼</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">貨幣名稱：</span>
            <UInput
              :class="['col-span-3', dataValidate.currencyName ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.currencyName"
              type="search" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currencyName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入貨幣名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">貨幣符號：</span>
            <UInput
              :class="['col-span-3', dataValidate.currencySymbol ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.currencySymbol"
              type="search" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currencySymbol">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入貨幣符號</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">最小面額：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.minimumDenomination ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.minimumDenomination"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.minimumDenomination">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入最小面額</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">排序：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.sort ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.sort"
              orientation="vertical"
              :step="0.01" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.sort">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入排序</span>
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="currencyDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  fetchCurrencyByCurrencyCode,
  fetchCurrencyCreate,
  fetchCurrencyUpdate,
  fetchCurrencyDelete,
} from "@/server/parameterApi";
import { ICurrencyList, IResponse } from "@/models/index";
import { messageToast, errorMessageDialog, showConfirmDialog } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ currencyCodeGot?: string }>(), { currencyCodeGot: "" });
const emits = defineEmits(["dataReseaching"]);

const open = ref<boolean>(false);
const getDefaultDataParams = (): ICurrencyList => ({
  currencyCode: props.currencyCodeGot || "",
  currencyName: "",
  currencySymbol: "",
  minimumDenomination: 1,
  sort: 0,
});
const dataParams = reactive<ICurrencyList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  currencyCode: true,
  currencyName: true,
  currencySymbol: true,
  minimumDenomination: true,
  sort: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());

watch(open, () => {
  if (open.value === true) {
    if (props.currencyCodeGot) {
      searchingCurrencyData();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingCurrencyData() {
  // console.log("props:", props.currencyCodeGot);

  try {
    const res: IResponse = await fetchCurrencyByCurrencyCode(props.currencyCodeGot);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      // dataParams.currencyCode = res.data.data.currencyCode;
      // dataParams.currencyName = res.data.data.currencyName;
      // dataParams.currencySymbol = res.data.data.currencySymbol;
      // dataParams.minimumDenomination = res.data.data.minimumDenomination;
      // dataParams.sort = res.data.data.sort;
    } else {
      messageToast({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function validateData() {
  dataValidate.currencyCode = true;
  dataValidate.currencyName = true;
  dataValidate.currencySymbol = true;
  dataValidate.minimumDenomination = true;
  dataValidate.sort = true;

  if (!dataParams.currencyCode) {
    dataValidate.currencyCode = false;
  }
  if (!dataParams.currencyName) {
    dataValidate.currencyName = false;
  }
  if (!dataParams.currencySymbol) {
    dataValidate.currencySymbol = false;
  }
  if (dataParams.minimumDenomination === null || dataParams.minimumDenomination < 0) {
    dataValidate.minimumDenomination = false;
  }
  if (dataParams.sort === null || dataParams.sort <= 0 || !Number.isInteger(dataParams.sort)) {
    dataValidate.sort = false;
  }

  if (
    !dataValidate.currencyCode ||
    !dataValidate.currencyName ||
    !dataValidate.currencySymbol ||
    !dataValidate.minimumDenomination ||
    !dataValidate.sort
  ) {
    return false;
  } else {
    return true;
  }
}

async function currencyDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.currencyCodeGot ? fetchCurrencyUpdate : fetchCurrencyCreate)(dataParams);
    console.log("res:", res);
    if (res.data.returnCode === 0) {
      messageToast({ message: res.data.message });
      open.value = false;
      emits("dataReseaching");
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function removeCurrency() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除該貨幣資料",
    confirmButtonMsg: "刪除",
    executionApi: fetchCurrencyDelete,
    apiParams: props.currencyCodeGot,
  });

  if (confirmResult) {
    open.value = false;
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
