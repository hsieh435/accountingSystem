<template>
  <div style="width: 100%; height: 400px">
    <canvas :id="`currencyExRateRecordChart${props.searchingParamsGot.currencyId}`"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchCurrencyHistoryExRate } from "@/server/outerApi.ts";
import { ICurrencyExRateSearchingParams, IResponse } from "@/models/index.ts";
import { messageToast, showDataLengthMsg } from "@/composables/swalDialog.ts";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: ICurrencyExRateSearchingParams }>(), {
  searchingParamsGot: () => ({ currencyId: "", startDate: "", endDate: "" }),
});

const dataLabels = ref<string[]>([]);
const currencyCashBuyExRate = ref<number[]>([]);
const currencyCashSellExRate = ref<number[]>([]);
const currencySpotBuyExRate = ref<number[]>([]);
const currencySpotSellExRate = ref<number[]>([]);

watch(
  props,
  () => {
    searchingCurrencyExRate();
  },
  { deep: true },
);

let chartInstance: Chart | null = null;

async function searchingCurrencyExRate() {
  try {
    const res: IResponse = await fetchCurrencyHistoryExRate(props.searchingParamsGot);
    const historyData = res.data.data.data ?? [];

    showDataLengthMsg({
      dataLength: historyData.length,
      dataName: "匯率歷史資料",
    });

    if (historyData.length === 0) {
      dataLabels.value = [];
      currencyCashBuyExRate.value = [];
      currencyCashSellExRate.value = [];
      currencySpotBuyExRate.value = [];
      currencySpotSellExRate.value = [];

      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    dataLabels.value = historyData.map((exRate: any) => exRate.date);
    currencyCashBuyExRate.value = historyData.map((exRate: any) => exRate.cash_buy);
    currencyCashSellExRate.value = historyData.map((exRate: any) => exRate.cash_sell);
    currencySpotBuyExRate.value = historyData.map((exRate: any) => exRate.spot_buy);
    currencySpotSellExRate.value = historyData.map((exRate: any) => exRate.spot_sell);

    renderingChart();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function renderingChart() {
  const currencyExRateRecordChartCurrencyId = document.getElementById(
    `currencyExRateRecordChart${props.searchingParamsGot.currencyId}`,
  ) as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = Math.max(
    ...[
      ...currencyCashBuyExRate.value,
      ...currencyCashSellExRate.value,
      ...currencySpotBuyExRate.value,
      ...currencySpotSellExRate.value,
    ],
  );
  const scalesMin = Math.min(
    ...[
      ...currencyCashBuyExRate.value,
      ...currencyCashSellExRate.value,
      ...currencySpotBuyExRate.value,
      ...currencySpotSellExRate.value,
    ],
  );
  //
  chartInstance = new Chart(currencyExRateRecordChartCurrencyId, {
    data: {
      datasets: [
        {
          type: "line",
          label: "現金買入",
          data: currencyCashBuyExRate.value,
        },
        {
          type: "line",
          label: "現金賣出",
          data: currencyCashSellExRate.value,
        },
        {
          type: "line",
          label: "即期買入",
          data: currencySpotBuyExRate.value,
        },
        {
          type: "line",
          label: "即期賣出",
          data: currencySpotSellExRate.value,
        },
      ],
      labels: dataLabels.value,
    },
    options: {
      scales: {
        y: {
          min: Math.floor(scalesMin * 0.9),
          max: Math.ceil(scalesMax * 1.1),
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              // console.log(tooltipItems);
              return tooltipItems[0].label;
            },
            label: function (tooltipItems) {
              // console.log(tooltipItems);
              return tooltipItems.dataset.label + "：" + tooltipItems.formattedValue;
            },
            // footer: function () {
            //   return   "";
            // },
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
</script>
<style lang="scss" scoped></style>
