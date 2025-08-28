<template>
  <div class="flex-col justify-start items-center">
    <stockSearching @sendbackSearchingData="settingstockinfo" />
  </div>
  <template v-if="stockDataLineChart.length > 0">
    <div class="px-1">
      <chart :chartType="'line'" :chartTitle="lineChartTitle" :data="stockDataLineChart"></chart>
    </div>
  </template>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { IStockPriceRecordList } from "@/models/index";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
});

const stockSearching = defineAsyncComponent(
  () => import("@/components/outerInformationComponents/stock/stockSearching.vue"),
);
const chart = defineAsyncComponent(() => import("@/components/chart/index.vue"));

const lineChartTitle = ref<string>("");
let stockData = reactive<IStockPriceRecordList[]>([]);
let stockDataLineChart = ref<{ label: string; data: number }[]>([]);

async function settingstockinfo(chartTitle: string, stockPriceRecord: IStockPriceRecordList[]) {
  stockDataLineChart.value = [];
  lineChartTitle.value = chartTitle;
  stockData = JSON.parse(JSON.stringify(stockPriceRecord));
  stockDataLineChart.value = stockData.map((record) => {
    return {
      label: record.date.replace(/-/g, "/"),
      data: record.close,
    };
  });
}
</script>
<style lang="scss" scoped></style>
