<template>
  <!-- <template v-if="props.tradeCodeGot">
    <ui-buttonGroup showView :viewText="'檢視交易代碼'" @dataView="searchingTradeCategory()" />
    <ui-buttonGroup showRemove :createText="'刪除交易代碼'" @dataRemove="removeTradeCategory()" />
  </template>
  <template v-if="!props.tradeCodeGot">
    <ui-buttonGroup showCreate :createText="'新增交易代碼'" @dataCreate="tradeCategoryDataHandling()" />
  </template> -->
  <UModal
    title="收支資料設定"
    description="資料內容"
    v-model:open="open"
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

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易代碼：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses('col-span-3'),
                dataValidate.tradeCode ? 'outline-red-50' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.tradeCode"
              :disabled="props.tradeCodeGot.length > 0" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeCode">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入交易代碼</span>
          </div>
        </div>

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>交易名稱：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses('col-span-3'),
                dataValidate.tradeName ? 'outline-red-50' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.tradeName" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.tradeName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入交易名稱</span>
          </div>
        </div>

        <div>
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>排序：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses('col-span-3'),
                dataValidate.sort ? 'outline-red-50' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.sort"
              type="number" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.sort">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入排序</span>
          </div>
        </div>

        <div class="flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right">適用：</span>
          <div class="flex flex-wrap justify-start items-center col-span-4">
            <div class="me-2">
              <input class="border border-gray-300 mx-1" v-model="dataParams.isCashflowAble" type="checkbox" />
              <label for="isCashflowAble">現金</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" v-model="dataParams.isStoredvaluecardAble" type="checkbox" />
              <label for="isStoredvaluecardAble">儲值票卡</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" v-model="dataParams.isCreditcardAble" type="checkbox" />
              <label for="isCreditcardAble">信用卡</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" v-model="dataParams.isCuaccountAble" type="checkbox" />
              <label for="isCuaccountAble">存款帳戶</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" v-model="dataParams.isStaccountAble" type="checkbox" />
              <label for="isStaccountAble">證券帳戶</label>
            </div>
          </div>
        </div>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="tradeCategoryDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
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
} from "@/server/parameterApi";
import { ITradeCategory, IResponse } from "@/models/index";
import { messageToast, errorMessageDialog, showConfirmDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

const props = withDefaults(defineProps<{ tradeCodeGot?: string }>(), { tradeCodeGot: "" });
const emits = defineEmits(["dataReseaching"]);

const open = ref<boolean>(false);
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
const getDefaultDataValidate = (): any => ({
  tradeCode: true,
  tradeName: true,
  sort: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());

watch(open, () => {
  if (open.value === true) {
    if (props.tradeCodeGot) {
      searchingTradeCategory();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingTradeCategory() {
  // console.log("props:", props.tradeCodeGot);

  try {
    const res: IResponse = await fetchTradeCategory(props.tradeCodeGot);
    // console.log("res:", res);
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
      // dataParams.tradeCode = res.data.data.tradeCode;
      // dataParams.tradeName = res.data.data.tradeName;
      // dataParams.isCashflowAble = res.data.data.isCashflowAble;
      // dataParams.isStoredvaluecardAble = res.data.data.isStoredvaluecardAble;
      // dataParams.isCreditcardAble = res.data.data.isCreditcardAble;
      // dataParams.isCuaccountAble = res.data.data.isCuaccountAble;
      // dataParams.isStaccountAble = res.data.data.isStaccountAble;
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

  if (!dataParams.tradeCode) {
    dataValidate.tradeCode = false;
  }
  if (!dataParams.tradeName) {
    dataValidate.tradeName = false;
  }
  if (!dataParams.sort) {
    dataValidate.sort = false;
  }
  if (!dataValidate.tradeCode || !dataValidate.tradeName || !dataValidate.sort) {
    return false;
  } else {
    return true;
  }
}

async function tradeCategoryDataHandling() {
  if (!(await validateData())) return;

  try {
    const res: IResponse = await (props.tradeCodeGot ? fetchUpdateTradeCategory : fetchCreateTradeCategory)(dataParams);
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

async function removeTradeCategory() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除該交易代碼",
    confirmButtonMsg: "確定刪除",
    executionApi: fetchDeleteTradeCategory,
    apiParams: props.tradeCodeGot,
  });

  if (confirmResult) {
    open.value = false;
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
