<template>
  <div style="width: 100%; height: 400px">
    <canvas id="currencyLatestExRateChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchCurrencyLatestExRate } from "@/server/outerWebApi";
import { ICurrencyExRateSearchingParams, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: ICurrencyExRateSearchingParams }>(), {
  searchingParamsGot: () => ({ currencyId: "", startDate: "", endDate: "" }),
});

const currencyExRate = ref<{ currencyName: string; exchangeRate: number }[]>([]);

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
    const res: IResponse = await fetchCurrencyLatestExRate(props.searchingParamsGot.currencyId);
    // console.log("fetchCurrencyLatestExRate:", res.data.data);
    if (res.data.returnCode === 0) {
      currencyExRate.value = Object.entries(res.data.data.rates).map(([key, value]) => ({
        currencyName: key || "?",
        exchangeRate: Number(value) || 0,
      }));
      console.log("currencyExRate.value:", currencyExRate.value);
      renderingChart();
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function renderingChart() {
  const currencyLatestExRateChart = document.getElementById("currencyLatestExRateChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // const scalesMax = Math.max(...currencyExRate.value);
  const scalesMax = 150;
  // chartInstance = new Chart(currencyLatestExRateChart, {
  //   data: {
  //     datasets: [
  //       {
  //         type: "line",
  //         label: "匯率",
  //         data: currencyExRate.value,
  //       },
  //     ],
  //     labels: dataLabels.value,
  //   },
  //   options: {
  //     scales: {
  //       y: {
  //         min: 0,
  //         max: Math.ceil(scalesMax * 1.1),
  //       },
  //     },
  //   interaction: {
  //     mode: "index",
  //     intersect: false,
  //   },
  //     plugins: {
  //       tooltip: {
  //         callbacks: {
  //           title: function (tooltipItems) {
  //             // console.log(tooltipItems);
  //             return yearMonthDayTimeFormat(tooltipItems[0].label, false);
  //           },
  //           label: function (tooltipItems) {
  //             // console.log(tooltipItems);
  //             return tooltipItems.dataset.label + "：" + tooltipItems.formattedValue + "%";
  //           },
  //           // footer: function () {
  //           //   return   "";
  //           // },
  //         },
  //       },
  //     },
  //     responsive: true,
  //     maintainAspectRatio: false,
  //   },
  // });
}
</script>
<style lang="scss" scoped></style>
