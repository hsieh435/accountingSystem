<template>
  <UModal
    title="收支資料設定"
    description="資料內容"
    v-model:open="opentradecategorydata"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.tradeCodeGot">
      <ui-buttonGroup showView :viewText="'檢視交易代碼'" />
      <ui-buttonGroup showRemove :createText="'刪除交易代碼'" @dataRemove="removeTradeCategory()" />
    </template>
    <template v-if="!props.tradeCodeGot">
      <ui-buttonGroup showCreate :createText="'新增交易代碼'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易代碼：</span>
            <UInput
              :class="['col-span-3', dataValidate.tradeCode ? 'outline-red-50' : 'outline-1 outline-red-500']"
              v-model="dataParams.tradeCode"
              :disabled="props.tradeCodeGot.length > 0" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCode">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入交易代碼</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易名稱：</span>
            <UInput
              :class="['col-span-3', dataValidate.tradeName ? 'outline-red-50' : 'outline-1 outline-red-500']"
              v-model="dataParams.tradeName" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入交易名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>排序：</span>
            <UInputNumber
              :class="['col-span-3', dataValidate.sort ? '' : 'outline-1 outline-red-500']"
              v-model="dataParams.sort"
              orientation="vertical" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.sort">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入排序</span>
          </div>
        </div>

        <div class="flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right">適用：</span>
          <div class="flex flex-wrap justify-start items-center col-span-3">
            <UCheckbox class="mx-2" v-model="dataParams.isCashflowAble" label="現金" />
            <UCheckbox class="mx-2" v-model="dataParams.isStoredvaluecardAble" label="儲值票卡" />
            <UCheckbox class="mx-2" v-model="dataParams.isCreditcardAble" label="信用卡" />
            <UCheckbox class="mx-2" v-model="dataParams.isCuaccountAble" label="存款帳戶" />
            <UCheckbox class="mx-2" v-model="dataParams.isStaccountAble" label="證券帳戶" />
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="tradeCategoryDataHandling" />
          <ui-buttonGroup showClose @dataClose="opentradecategorydata = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import {
  fetchTradeCategory,
  fetchCreateTradeCategory,
  fetchUpdateTradeCategory,
  fetchDeleteTradeCategory,
} from "@/server/parameterApi.ts";
import { ITradeCategory, IResponse } from "@/models/index.ts";
import { dataObjectValidate } from "@/composables/tools.ts";
import { messageToast, showConfirmDialog } from "@/composables/swalDialog.ts";

const props = withDefaults(defineProps<{ tradeCodeGot?: string }>(), { tradeCodeGot: "" });
const emits = defineEmits(["dataReseaching"]);

const opentradecategorydata = ref<boolean>(false);
const getDefaultDataParams = (): ITradeCategory => ({
  tradeCode: props.tradeCodeGot || "",
  tradeName: "",
  isCashflowAble: false,
  isStoredvaluecardAble: false,
  isCreditcardAble: false,
  isCuaccountAble: false,
  isStaccountAble: false,
  sort: 0,
});
const dataParams = reactive<ITradeCategory>(getDefaultDataParams());
const getDefaultDataValidate = (): { [key: string]: boolean } => ({
  tradeCode: true,
  tradeName: true,
  sort: true,
});
const dataValidate = reactive<{ [key: string]: boolean }>(getDefaultDataValidate());

watch(opentradecategorydata, () => {
  if (opentradecategorydata.value === true) {
    if (props.tradeCodeGot) {
      searchingTradeCategory();
    }
  } else if (opentradecategorydata.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingTradeCategory() {
  // console.log("props:", props.tradeCodeGot);

  try {
    const res: IResponse = await fetchTradeCategory(props.tradeCodeGot);
    // console.log("res:", res);
    Object.assign(dataParams, res.data.data);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function validateData() {
  Object.assign(dataValidate, getDefaultDataValidate());

  if (!dataParams.tradeCode) {
    dataValidate.tradeCode = false;
  }
  if (!dataParams.tradeName) {
    dataValidate.tradeName = false;
  }
  if (!dataParams.sort) {
    dataValidate.sort = false;
  }

  return dataObjectValidate(dataValidate);
}

async function tradeCategoryDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeCodeGot ? fetchUpdateTradeCategory : fetchCreateTradeCategory)(dataParams);
    console.log("res:", res);
    messageToast({ message: res.data.message });
    opentradecategorydata.value = false;
    emits("dataReseaching");
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function removeTradeCategory() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除該交易代碼",
    confirmButtonMsg: "確定刪除",
    executionApi: fetchDeleteTradeCategory,
    apiParams: props.tradeCodeGot,
  });

  if (confirmResult) {
    opentradecategorydata.value = false;
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
