<template>
  <div class="flex-col justify-start items-center">
    <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
      <div class="flex items-center me-3 my-1">
        <span>股票：</span><stockListSelect @sendbackStockNo="settingStockNo" />
      </div>
      <div class="flex items-center me-3 my-1">
        <span>查詢區間：</span>
        <dateSelect
          :dateSelect="searchingParams.startDate"
          :minDate="'1967-01-01'"
          :maxDate="dateMove(searchingParams.endDate, -1)"
          @sendbackDate="settingStart" />
        <span class="mx-1">～</span>
        <dateSelect
          :dateSelect="searchingParams.endDate"
          :minDate="dateMove(searchingParams.startDate, 1)"
          :maxDate="getCurrentYMD()"
          @sendbackDate="settingEnd" />
      </div>
      <ui-buttonGroup
        showSearch
        :searchDisable="!searchingParams.stockNo || searchingParams.startDate === searchingParams.endDate"
        @dataSearch="sendingParams()" />
    </div>

    <div class="px-5">
      <UTabs :items="items" variant="link" :ui="{ trigger: 'grow' }" class="gap-4">
        <template #chart>
          <stockPriceLineChart :searchingParamsGot="stockPriceParams" />
        </template>
        <template #perpbr>
          <stockPerPrb />
        </template>
        <template #interest>
          <stockInterest :searchingParamsGot="stockPriceParams" />
        </template>
      </UTabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { IStockPriceSearchingParams, IStockList } from "@/models/index";
import { getCurrentYMD, getCurrentYear, getCurrentMonth, getCurrentDate, dateMove } from "@/composables/tools";
import type { TabsItem } from "@nuxt/ui";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
});

const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));
const stockPriceLineChart = defineAsyncComponent(
  () => import("@/components/outerInformationComponents/stock/stockPriceLineChart.vue"),
);
const stockPerPrb = defineAsyncComponent(() => import("@/components/outerInformationComponents/stock/stockPerPrb.vue"));
const stockInterest = defineAsyncComponent(
  () => import("@/components/outerInformationComponents/stock/stockInterest.vue"),
);

const searchingParams = reactive<IStockPriceSearchingParams>({
  stockNo: "",
  stockName: "",
  startDate: `${getCurrentYear()}-${getCurrentMonth() - 1}-${getCurrentDate()}`,
  endDate: getCurrentYMD(),
});

const stockPriceParams = ref<IStockPriceSearchingParams>({
  stockNo: "",
  stockName: "",
  startDate: "",
  endDate: "",
});

const items = [
  {
    label: "股價走勢",
    icon: "i-lucide-chart-no-axes-combined",
    slot: "chart" as const,
  },
  {
    label: "本益比 / 股價淨值比",
    icon: "i-lucide-circle-dollar-sign",
    slot: "perpbr" as const,
  },
  {
    label: "除權息",
    icon: "i-lucide-circle-dollar-sign",
    slot: "interest" as const,
  },
] satisfies TabsItem[];

// PER：本益比（Price-to-Earning Ratio）
// PBR：股價淨值比（Price-to-Book Ratio）

async function settingStockNo(selectedData: IStockList) {
  searchingParams.stockNo = selectedData.stock_id;
  searchingParams.stockName = selectedData.stock_name;
}

async function settingStart(date: string) {
  searchingParams.startDate = date;
}

async function settingEnd(date: string) {
  searchingParams.endDate = date;
}

async function sendingParams() {
  // console.log("searchingParams:", searchingParams);
  stockPriceParams.value = { ...searchingParams };
}
</script>
<style lang="scss" scoped></style>
