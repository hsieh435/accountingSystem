<template>
  <div style="width: 100%; height: 400px">
    <canvas id="stockPerPbrChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchStockPerPbr } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IStockPriceRecordList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), {
  searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }),
});

const dataLabels = ref<string[]>([]);
const stockPer = ref<number[]>([]);
const stockPbr = ref<number[]>([]);
const stockDividendYield = ref<number[]>([]);

watch(
  props,
  () => {
    searchingStockPerPbr();
  },
  { deep: true },
);

let chartInstance: Chart | null = null;
async function searchingStockPerPbr() {
  // console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockPerPbr(props.searchingParamsGot);
    // console.log("fetchStockPerPbr:", res.data.data);
    if (res.data.returnCode === 0) {
      if (res.data.data.data.length > 0) {
        dataLabels.value = res.data.data.data.map((stock: any) => {
          return stock.date;
        });
        stockPer.value = res.data.data.data.map((stock: any) => {
          return stock.PER;
        });
        stockPbr.value = res.data.data.data.map((stock: any) => {
          return stock.PBR;
        });
        stockDividendYield.value = res.data.data.data.map((stock: any) => {
          return stock.dividend_yield;
        });

      } else {
        dataLabels.value = ["無資料"];
        stockPer.value = [0];
        stockPbr.value = [0];
        stockDividendYield.value = [0];
      }
      renderingChart();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function renderingChart() {
  const stockPerPbrChart = document.getElementById("stockPerPbrChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = Math.max(...[...stockPer.value, ...stockPbr.value, ...stockDividendYield.value]);
  chartInstance = new Chart(stockPerPbrChart, {
    data: {
      datasets: [
        {
          type: "line",
          label: "本益比",
          data: stockPer.value,
        },
        {
          type: "line",
          label: "股價淨值比",
          data: stockPbr.value,
        },
        {
          type: "line",
          label: "殖利率",
          data: stockDividendYield.value,
        },
      ],
      labels: dataLabels.value,
    },
    options: {
      scales: {
        y: {
          min: 0,
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
              return yearMonthDayTimeFormat(tooltipItems[0].label, false);
            },
            label: function (tooltipItems) {
              // console.log(tooltipItems);
              return tooltipItems.dataset.label + "：" + tooltipItems.formattedValue + "%";
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
<!-- PER：本益比（Price-to-Earning Ratio） -->
<!-- PBR：股價淨值比（Price-to-Book Ratio） -->
