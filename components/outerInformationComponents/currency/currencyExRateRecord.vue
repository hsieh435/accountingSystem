<template>
  <div style="width: 100%; height: 400px">
    <canvas id="currencyExRateRecordChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchCurrencyHistoryExRate } from "@/server/outerWebApi";
import { ICurrencyExRateSearchingParams, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
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
  console.log("searchingParams:", props.searchingParamsGot);

  try {
    const res: IResponse = await fetchCurrencyHistoryExRate(props.searchingParamsGot);
    console.log("fetchCurrencyHistoryExRate:", res.data.data);
    if (res.data.returnCode === 0) {
      if (res.data.data.data.length > 0) {
        dataLabels.value = res.data.data.data.map((exRate: any) => {
          return exRate.date;
        });
        currencyCashBuyExRate.value = res.data.data.data.map((exRate: any) => {
          return exRate.cash_buy;
        });
        currencyCashSellExRate.value = res.data.data.data.map((exRate: any) => {
          return exRate.cash_sell;
        });
        currencySpotBuyExRate.value = res.data.data.data.map((exRate: any) => {
          return exRate.spot_buy;
        });
        currencySpotSellExRate.value = res.data.data.data.map((exRate: any) => {
          return exRate.spot_sell;
        });

        renderingChart();
      } else {
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
      }
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function renderingChart() {
  const currencyExRateRecordChart = document.getElementById("currencyExRateRecordChart") as HTMLCanvasElement;

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
  chartInstance = new Chart(currencyExRateRecordChart, {
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
