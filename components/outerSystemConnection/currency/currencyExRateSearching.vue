<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>貨幣：</span><dataBaseCurrencySelect @sendbackCurrencyData="settingCurrency" />
    </div>
    <div class="flex items-center me-3 my-1">
      <span>查詢區間：</span
      ><dateSelect
        :dateSelect="searchingParams.startDate"
        :minDate="'2006-01-01'"
        :maxDate="getCurrentYMD()"
        @sendbackDateRange="settingStartDate" />
      <span class="mx-1">～ 至今（自 2006 年開始）</span>
    </div>
    <ui-buttonGroup
      showSearch
      :searchText="'查詢今日匯率'"
      :searchDisable="!searchingParams.currencyId || searchingParams.currencyId === 'TWD'"
      @dataSearch="searchingCurrencyExRate()" />
    <ui-buttonGroup
      showSearch
      :searchText="'查詢歷史紀錄'"
      :searchDisable="!searchingParams.currencyId"
      @dataSearch="searchingCurrencyHistoryExRate()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive } from "vue";
import { fetchCurrencyLatestExRate, fetchCurrencyHistoryExRate } from "@/server/outerApi.ts";
import { ICurrencyExRateSearchingParams, ICurrencyList, IResponse } from "@/models/index.ts";
import { getCurrentYMD, getCurrentYear } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";

const emits = defineEmits(["sendbackSearchingData"]);

const dataBaseCurrencySelect = defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const searchingParams = reactive<ICurrencyExRateSearchingParams>({
  currencyId: "",
  startDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYMD(),
});

function settingCurrency(currencyData: ICurrencyList) {
  searchingParams.currencyId = currencyData.currencyCode;
}

async function settingStartDate(startDate: string) {
  searchingParams.startDate = startDate;
}

async function searchingCurrencyExRate() {
  // emits("sendbackSearchingData", searchingParams);

  try {
    const res: IResponse = await fetchCurrencyLatestExRate(searchingParams.currencyId);
    console.log("fetchCurrencyExRateInfoList:", res.data.data);
    //
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function searchingCurrencyHistoryExRate() {
  try {
    const res: IResponse = await fetchCurrencyHistoryExRate(searchingParams);
    console.log("fetchCurrencyHistoryExRate:", res.data.data);
    //
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
