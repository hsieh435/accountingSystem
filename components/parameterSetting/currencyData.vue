<template>
  <UModal
    title="貨幣資料設定"
    description="資料內容"
    v-model:open="opencurrencydata"
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
            <span class="col-span-4 col-end-7 text-red-500">請輸入貨幣代碼</span>
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
            <span class="col-span-4 col-end-7 text-red-500">請輸入貨幣名稱</span>
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
            <span class="col-span-4 col-end-7 text-red-500">請輸入貨幣符號</span>
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
            <span class="col-span-4 col-end-7 text-red-500">請輸入最小面額</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">排序：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.sort ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.sort"
              orientation="vertical"
              :step="1" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.sort">
            <span class="col-span-4 col-end-7 text-red-500">請輸入排序</span>
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="currencyDataHandling" />
          <ui-buttonGroup showClose @dataClose="opencurrencydata = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { fetchCurrencyByCurrencyCode, fetchCurrencyCreate, fetchCurrencyUpdate, fetchCurrencyDelete } from "@/server/parameterApi.ts";
import { ICurrencyList, IResponse } from "@/models/index.ts";
import { dataObjectValidate } from "@/composables/tools.ts";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog.ts";

const props = withDefaults(defineProps<{ currencyCodeGot?: string }>(), { currencyCodeGot: "" });
const emits = defineEmits(["dataReseaching"]);

const opencurrencydata = ref<boolean>(false);
const getDefaultDataParams = (): ICurrencyList => ({
  currencyCode: props.currencyCodeGot || "",
  currencyName: "",
  currencySymbol: "",
  minimumDenomination: 1,
  sort: 0,
});
const dataParams = reactive<ICurrencyList>(getDefaultDataParams());
const getDefaultDataValidate = (): { [key: string]: boolean } => ({
  currencyCode: true,
  currencyName: true,
  currencySymbol: true,
  minimumDenomination: true,
  sort: true,
});
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultDataValidate());

watch(opencurrencydata, () => {
  if (opencurrencydata.value === true) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
    if (props.currencyCodeGot) {
      searchingCurrencyData();
    }
  }
});

async function searchingCurrencyData() {
  // console.log("props:", props.currencyCodeGot);

  try {
    const res: IResponse = await fetchCurrencyByCurrencyCode(props.currencyCodeGot);
    console.log("res:", res.data.data);
    Object.assign(dataParams, res.data.data);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function validateData() {
  Object.assign(dataValidate, getDefaultDataValidate());

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

  return dataObjectValidate(dataValidate);
}

async function currencyDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.currencyCodeGot ? fetchCurrencyUpdate : fetchCurrencyCreate)(dataParams);
    console.log("res:", res);
    messageToast({ message: res.data.message });
    opencurrencydata.value = false;
    emits("dataReseaching");
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
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
    opencurrencydata.value = false;
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
