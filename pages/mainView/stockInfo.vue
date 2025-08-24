<template>
  <div class="flex-col justify-start items-center">
    <stockSearching @sendbackSearchingData="settingstockinfo" />
  </div>
  <div class="px-1">
    <!-- <client-only>
      <div id="myStockLineChart"></div>
    </client-only> -->
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { IStockPriceRecordList } from "@/models/index";
import Plotly from "plotly.js";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
});

const stockSearching = defineAsyncComponent(() => import("@/components/outerInformationComponents/stock/stockSearching.vue"));

const stockData = ref<IStockPriceRecordList[]>([]);

async function settingstockinfo(plotlyTitle: string, stockPriceRecord: IStockPriceRecordList[]) {
  // console.log(plotlyTitle);
  console.log(stockPriceRecord);
  stockData.value = JSON.parse(JSON.stringify(stockPriceRecord));

  var data: Plotly.Data[] = [
    {
      x: stockPriceRecord.map((record) => record.date),
      y: stockPriceRecord.map((record) => record.close),
      type: "scatter",
    },
  ];
  var layout = {
    title: { text: plotlyTitle },
    xaxis: {
      autorange: true,
      // range: ["2015-02-17", "2017-02-16"],
      rangeselector: {
        buttons: [
          {
            count: 1,
            label: "1m",
            step: "month",
            stepmode: "backward",
          },
          {
            count: 6,
            label: "6m",
            step: "month",
            stepmode: "backward",
          },
          { step: "all" },
        ],
      },
      // rangeslider: { range: ["2015-02-17", "2017-02-16"] },
      type: "date",
    },
    yaxis: {
      autorange: true,
      range: [
        Math.min(...stockPriceRecord.map((record) => record.close)) * 0.8,
        Math.max(...stockPriceRecord.map((record) => record.close)) * 1.2,
      ],
      type: "linear",
    },
  } as Partial<Plotly.Layout>;

  // Plotly.newPlot("myStockLineChart", data, layout);
}
</script>
<style lang="scss" scoped></style>
