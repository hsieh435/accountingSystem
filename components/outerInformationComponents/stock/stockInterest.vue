<template>
  <div style="width: 100%; height: 400px">
    <canvas id="earningsChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchStockDividendResult } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IResponse } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), {
  searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }),
});

const dataLabels = ref<string[]>([]);
const cashEarningsData = ref<number[]>([]);
const stockEarningsData = ref<number[]>([]);

watch(
  props,
  () => {
    searchingStockInterest();
  },
  { deep: true },
);

let chartInstance: Chart | null = null;
async function searchingStockInterest() {
  // console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockDividendResult(props.searchingParamsGot);
    // console.log("fetchStockDividendResult:", res.data.data.data);
    if (res.data.returnCode === 0) {
      if (res.data.data.data.length > 0) {
        dataLabels.value = res.data.data.data.map((stock: any) => {
          return stock.year;
        });
        cashEarningsData.value = res.data.data.data.map((stock: any) => {
          return stock.CashEarningsDistribution;
        });
        stockEarningsData.value = res.data.data.data.map((stock: any) => {
          return stock.StockEarningsDistribution;
        });
        renderingChart();
        // console.log("dataLabels:", dataLabels.value);
        // console.log("cashEarningsData:", cashEarningsData.value);
        // console.log("stockEarningsData:", stockEarningsData.value);
      } else {
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
      }
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function renderingChart() {
  // console.log(props.chartType);
  const earningsChart = document.getElementById("earningsChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = Math.max(...[...cashEarningsData.value, ...stockEarningsData.value]);
  chartInstance = new Chart(earningsChart, {
    data: {
      datasets: [
        {
          type: "bar",
          label: "配息",
          data: cashEarningsData.value,
        },
        {
          type: "bar",
          label: "配股",
          data: stockEarningsData.value,
        },
      ],
      labels: dataLabels.value,
    },
    options: {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          min: 0,
          max: Math.ceil(scalesMax * 1.1),
          stacked: true,
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
              return tooltipItems.dataset.label + "：" + tooltipItems.formattedValue;
            },
            // footer: function () {
            //   return "";
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
<!-- https://www.chartjs.org/docs/latest/charts/mixed.html -->
