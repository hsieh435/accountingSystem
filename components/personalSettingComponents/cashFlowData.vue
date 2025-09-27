<template>
  <UModal
    title="現金流資料設定"
    description="資料內容"
    v-model:open="open"
    :dismissible="false"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full',
    }">
    <template v-if="props.cashflowIdIdGot">
      <ui-buttonGroup showView :viewText="'檢視現金流資料'" />
      <ui-buttonGroup showRemove :removeText="'刪除現金流資料'" @dataRemove="removeCashFlowData()" />
    </template>
    <template v-if="!props.cashflowIdIdGot">
      <ui-buttonGroup showCreate :createText="'新增現金流資料'" />
    </template>
    <template #body>
      <div class="flex flex-col justify-center items-center gap-2">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>現金流名稱：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses('col-span-3'),
                dataValidate.cashflowName ? 'outline-red-50' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.cashflowName" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.cashflowName">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請輸入現金流名稱</span>
          </div>
        </div>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>現金流貨幣：</span>
            <div :class="['w-auto', dataValidate.currency ? 'outline-red-50' : 'outline-1 outline-red-500']">
              <dataBaseCurrencySelect
                :currencyIdGot="dataParams.currency"
                :isDisable="props.cashflowIdIdGot ? true : false"
                @sendbackCurrencyId="settingCurrency" />
            </div>
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.currency">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請選擇貨幣</span>
          </div>
        </div>

        <template v-if="props.cashflowIdIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">目前金額：</span>
            <input
              :class="tailwindStyles.getInputClasses('col-span-3')"
              :value="dataParams.presentAmount"
              type="number"
              disabled />
          </div>
        </template>
        <template v-else>
          <div class="w-full">
            <div class="flex justify-start items-center grid grid-cols-6">
              <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
              <input
                :class="[
                  tailwindStyles.getInputClasses('col-span-3'),
                  dataValidate.currencyCode ? 'outline-red-50' : 'outline-1 outline-red-500',
                ]"
                v-model="dataParams.startingAmount"
                type="number" />
            </div>
            <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.startingAmount">
              <span class="col-span-2 text-right"></span>
              <span class="col-span-4 text-red-500 mx-2">請填寫初始金額</span>
            </div>
          </div>
        </template>

        <div class="w-full">
          <div class="flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>最小持有金額：</span>
            <input
              :class="[
                tailwindStyles.getInputClasses('col-span-3'),
                dataValidate.currencyCode ? 'outline-red-50' : 'outline-1 outline-red-500',
              ]"
              v-model="dataParams.minimumValueAllowed"
              type="number" />
          </div>
          <div class="flex justify-start items-center grid grid-cols-6" v-if="!dataValidate.minimumValueAllowed">
            <span class="col-span-2 text-right"></span>
            <span class="col-span-4 text-red-500 mx-2">請填寫最小持有金額</span>
          </div>
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input :class="tailwindStyles.getInputClasses('col-span-3')" v-model="dataParams.alertValue" type="number" />
        </div>

        <div class="w-full flex justify-start items-center grid grid-cols-6">
          <span class="col-span-2 text-right">提醒：</span>
          <div class="col-span-4 flex justify-start items-center">
            <switchComponent :switchValueGot="dataParams.openAlert" @switchValueChanged="settingOpenAlert" />
          </div>
        </div>

        <div class="w-full flex justify-start items-start grid grid-cols-6">
          <span class="col-span-2 text-right my-1">附註：</span>
          <textarea :class="tailwindStyles.getInputClasses('col-span-3')" v-model="dataParams.note"></textarea>
        </div>

        <template v-if="props.cashflowIdIdGot">
          <div class="w-full flex justify-start items-center grid grid-cols-6">
            <span class="col-span-2 text-right">建立日期：</span>
            <input
              :class="tailwindStyles.getInputClasses('col-span-3')"
              :value="yearMonthDayTimeFormat(dataParams.createdDate)"
              disabled />
          </div>
        </template>

        <div class="my-2">
          <ui-buttonGroup showSave @dataSave="cashflowDataHandling" />
          <ui-buttonGroup showClose @dataClose="open = false" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import { fetchCashFlowById, fetchCashFlowCreate, fetchCashFlowUpdate, fetchCashFlowDelete } from "@/server/cashFlowApi";
import { ICashFlowList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const switchComponent = defineAsyncComponent(() => import("@/components/ui/switch.vue"));

const props = withDefaults(defineProps<{ cashflowIdIdGot?: string; isDisable?: boolean }>(), {
  cashflowIdIdGot: "",
  isDisable: false,
});
const emits = defineEmits(["dataReseaching"]);

const open = ref<boolean>(false);
const getDefaultDataParams = (): ICashFlowList => ({
  cashflowId: props.cashflowIdIdGot || "",
  userId: "",
  accountType: "cashFlow",
  cashflowName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<ICashFlowList>(getDefaultDataParams());
const getDefaultDataValidate = (): any => ({
  cashflowName: true,
  currency: true,
  startingAmount: true,
  presentAmount: true,
  minimumValueAllowed: true,
});
const dataValidate = reactive<any>(getDefaultDataValidate());

watch(open, () => {
  if (open.value === true) {
    if (props.cashflowIdIdGot) {
      searchingCashflowData();
    } else {
      Object.assign(dataParams, getDefaultDataParams());
    }
  } else if (open.value === false) {
    Object.assign(dataParams, getDefaultDataParams());
    Object.assign(dataValidate, getDefaultDataValidate());
  }
});

async function searchingCashflowData() {
  // console.log("props:", props);
  try {
    const res: IResponse = await fetchCashFlowById(props.cashflowIdIdGot);
    // console.log("fetchCashFlowById:", res.data.datares);
    if (res.data.returnCode === 0) {
      Object.assign(dataParams, res.data.data);
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function settingCurrency(currencyId: string) {
  dataParams.currency = currencyId;
}

async function settingOpenAlert(switchValue: boolean) {
  dataParams.openAlert = switchValue;
}

async function validateData() {
  dataValidate.cashflowName = true;
  dataValidate.currency = true;
  dataValidate.startingAmount = true;
  dataValidate.presentAmount = true;
  dataValidate.minimumValueAllowed = true;

  if (!dataParams.cashflowName) {
    dataValidate.cashflowName = false;
  }
  if (!dataParams.currency) {
    dataValidate.currency = false;
  }
  if (dataParams.startingAmount === null || dataParams.startingAmount <= 0) {
    dataValidate.startingAmount = false;
  }
  if (dataParams.presentAmount === null || dataParams.presentAmount <= 0) {
    dataValidate.presentAmount = false;
  }
  if (dataParams.minimumValueAllowed === null || dataParams.minimumValueAllowed <= 0) {
    dataValidate.minimumValueAllowed = false;
  }

  if (
    !dataValidate.cashflowName ||
    !dataValidate.currency ||
    !dataValidate.startingAmount ||
    !dataValidate.presentAmount ||
    !dataValidate.minimumValueAllowed
  ) {
    return false;
  } else {
    return true;
  }
}

async function cashflowDataHandling() {
  if (!(await validateData())) return;
  // console.log("dataParams:", dataParams);

  try {
    const res: IResponse = await (props.cashflowIdIdGot ? fetchCashFlowUpdate : fetchCashFlowCreate)(dataParams);
    // console.log("RES:", res);
    if (res.data.returnCode === 0) {
      showAxiosToast({ message: res.data.message });
      emits("dataReseaching");
      Object.assign(dataParams, getDefaultDataParams());
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function removeCashFlowData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除現金流資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchCashFlowDelete,
    apiParams: props.cashflowIdIdGot,
  });

  if (confirmResult) {
    open.value = false;
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
