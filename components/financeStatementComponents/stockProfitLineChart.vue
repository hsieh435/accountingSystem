<template>
  <div style="width: 100%; height: 400px">
    <canvas id="stockPriceChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { watch, ref } from "vue";
import { fetchStockRangeValue } from "@/server/outerWebApi";
import { fetchEachStockStorageData } from "@/server/storageProfitApi.ts";
import { IStockPriceSearchingParams, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), {
  searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }),
});

const lineChartTitle = ref<string>("");
const stockDataLineChart = ref<{ label: string; data: number }[]>([]);
let chartInstance: Chart | null = null;

watch(
  props,
  () => {
    searchingStockPrice();
  },
  { deep: true },
);

async function searchingStockPrice() {
  // console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockRangeValue(props.searchingParamsGot);
    // console.log("fetchStockRangeValue:", res.data.data);
    if (res.data.returnCode === 0) {
      lineChartTitle.value =
        props.searchingParamsGot.stockName +
        " " +
        props.searchingParamsGot.startDate.replace(/-/g, "/") +
        " ~ " +
        props.searchingParamsGot.endDate.replace(/-/g, "/") +
        "股價走勢";
      if (res.data.data.data.length > 0) {
        stockDataLineChart.value = res.data.data.data.map((record: any) => {
          return {
            label: record.date.replace(/-/g, "/"),
            data: record.close,
          };
        });
      } else {
        stockDataLineChart.value = [{ label: "無資料", data: 0 }];
      }
      renderingChart();
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

const getLabels = (chartData: any[]) => {
  const labels = chartData.map((v) => v.label);
  return labels;
};

const getData = (chartData: any[]) => {
  const data = chartData.map((v) => v.data);
  return data;
};

// CanvasRenderingContext2D
async function renderingChart() {
  // console.log(props.chartType);
  const stockPriceChart = document.getElementById("stockPriceChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = getData(stockDataLineChart.value)
    ? Math.ceil(Math.max(...getData(stockDataLineChart.value).map((data) => data)))
    : 10;
  const scalesMin = getData(stockDataLineChart.value)
    ? Math.floor(Math.min(...getData(stockDataLineChart.value).map((data) => data)))
    : 0;
  let variation = 0;

  chartInstance = new Chart(stockPriceChart, {
    type: "line",
    data: {
      labels: getLabels(stockDataLineChart.value) ? getLabels(stockDataLineChart.value) : [],
      datasets: [
        {
          label: lineChartTitle.value,
          data: getData(stockDataLineChart.value),
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min: Math.floor(scalesMin * 0.9) <= 5 ? 0 : Math.floor(scalesMin * 0.9),
          max: Math.ceil(scalesMax * 1.1) > 10 ? Math.ceil(scalesMax * 1.1) : 10,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function () {
              return "";
            },
            footer: function (tooltipItems) {
              // console.log("tooltipItems:", tooltipItems);
              let currentValue = 0;
              let lastValue = 0;
              tooltipItems.forEach(function (tooltipItem) {
                const index = tooltipItem.dataIndex;
                currentValue = Number(tooltipItem.dataset.data[index]);
                lastValue = index > 0 ? Number(tooltipItem.dataset.data[index - 1]) : 0;
                variation =
                  index === 0 || !Array.isArray(tooltipItem.dataset.data) || currentValue === null || lastValue === null
                    ? 0
                    : currentValue - lastValue;
              });
              return (
                currentValue +
                "\n" +
                (variation > 0 ? "▲" : variation < 0 ? "▼" : "") +
                (variation === 0
                  ? "0.00 ( 0.00 % ）"
                  : (lastValue <= 0 ? "" : variation.toFixed(2)) +
                    `（ ${lastValue <= 0 ? "N/A" : ((variation / lastValue) * 100).toFixed(2) + "%"} ）`)
              );
            },
          },
          footerColor: function () {
            switch (true) {
              case variation > 0:
                return "rgb(255, 0, 0)";
              case variation < 0:
                return "rgb(0, 128, 0)";
              default:
                return "rgb(255, 255, 255)";
            }
          },
          backgroundColor: "rgb(0, 0, 0)",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
</script>
