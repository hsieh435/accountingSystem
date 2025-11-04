<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full gap-x-3 gap-y-1 px-3 py-1">
    <div class="flex items-center">
      <span>{{ props.accountTypeName ? props.accountTypeName + "：" : "" }}</span>
      <accountSelect :selectTargetId="props.accountTypeId" :sellectAll="false" @sendbackAccount="settingAccountId" />
    </div>

    <div class="flex items-center">
      <span>貨幣：</span>
      <dataBaseCurrencySelect :currencyIdGot="searchParams.currencyId" :isDisable="searchParams.accountId.length > 0" @sendbackCurrencyData="settingCurrency" />
    </div>

    <div class="flex items-center">
      <span>收支類型：</span>
      <tradeCategorySelect :accountType="props.accountTypeId" @sendbackTradeCategory="settingTradeCategory" />
    </div>

    <div class="flex items-center">
      <span>時間區間：</span>
      <dateSelect
        :dateSelect="searchParams.startingDate"
        :maxDate="searchParams.endDate"
        @sendbackDate="settingSettingDate" />
      <span class="mx-1">～</span>
      <dateSelect
        :dateSelect="searchParams.endDate"
        :minDate="searchParams.startingDate"
        @sendbackDate="settingEndDate" />
    </div>

    <ui-buttonGroup showSearch @dataSearch="searchingRecord()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive } from "vue";
import { IFinanceRecordSearchingParams, ICashFlowList, ICurrencyList } from "@/models/index";
import { getCurrentYear } from "@/composables/tools";

const props = withDefaults(defineProps<{ accountTypeId?: string; accountTypeName?: string }>(), {
  accountTypeId: "",
  accountTypeName: "請選擇",
});
const emits = defineEmits(["sendbackSearchingParams"]);

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const tradeCategorySelect = defineAsyncComponent(() => import("@/components/ui/select/tradeCategorySelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});

async function settingAccountId(accountItem: ICashFlowList[]) {
  searchParams.accountId = accountItem[0].cashflowId || "";
  searchParams.currencyId = accountItem[0].currency || "";
}

async function settingCurrency(currencyData: ICurrencyList) {
  searchParams.currencyId = currencyData.currencyCode;
}

async function settingTradeCategory(tradeCategorySendback: string) {
  searchParams.tradeCategory = tradeCategorySendback;
}

async function settingSettingDate(dateSendback: string) {
  searchParams.startingDate = dateSendback + " 00:00:00.001";
}

async function settingEndDate(dateSendback: string) {
  searchParams.endDate = dateSendback + " 23:59:59.999";
}

async function searchingRecord() {
  // console.log("searchParams:", searchParams);
  emits("sendbackSearchingParams", searchParams);
}
</script>
<style lang="scss" scoped></style>
