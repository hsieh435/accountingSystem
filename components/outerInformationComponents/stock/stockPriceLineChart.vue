<template>
  <div style="width: 100%; height: 400px;">
    <canvas id="myChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref, reactive } from "vue";
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar, Scatter } from "vue-chartjs";
import { fetchStockRangeValue } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IStockPriceRecordList, IStockList, IResponse } from "@/models/index";
import { getCurrentYMD, getCurrentYear, getCurrentMonth, getCurrentDate, dateMove } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

// 父元件傳來的值
const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), { searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }) });



const lineChartTitle = ref<string>("");
let stockDataLineChart = ref<{ label: string; data: number }[]>([]);
const stockPriceRecord = ref<IStockPriceRecordList[]>([]);
const stockData = ref<IStockPriceRecordList[]>([]);



watch(props, () => {
  searchingStockPrice();
}, { deep: true });



async function searchingStockPrice() {
  // console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockRangeValue(props.searchingParamsGot);
    // console.log("fetchStockRangeValue:", res.data.data);
    if (res.data.returnCode === 0) {
      stockPriceRecord.value = res.data.data.data;

      if (stockPriceRecord.value.length > 0) {
        stockDataLineChart.value = [];
        lineChartTitle.value =
          props.searchingParamsGot.stockName + " " +
          props.searchingParamsGot.startDate.replace(/-/g, "/") + " ~ " +
          props.searchingParamsGot.endDate.replace(/-/g, "/") + "股價走勢";
        stockData.value = stockPriceRecord.value;
        stockDataLineChart.value = stockData.value.map((record) => {
          return {
            label: record.date.replace(/-/g, "/"),
            data: record.close,
          };
        });
        renderingChart();
      } else {
        showAxiosToast({ message: "查無資料", icon: "warning" });
      }
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
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

let chartInstance: Chart | null = null;

// CanvasRenderingContext2D
async function renderingChart() {
  // console.log(props.chartType);
  const myChart = document.getElementById("myChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = getData(stockDataLineChart.value) ? Math.ceil(Math.max(...getData(stockDataLineChart.value).map((data) => data))) : 10;
  const scalesMin = getData(stockDataLineChart.value) ? Math.floor(Math.min(...getData(stockDataLineChart.value).map((data) => data))) : 0;

  let variation = 0;


  chartInstance = new Chart(myChart, {
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
          min:
            Math.floor(scalesMin - (scalesMax - scalesMin) * 0.1) <= 0
              ? 0
              : Math.floor(scalesMin - (scalesMax - scalesMin) * 0.1),
          max: Math.ceil(scalesMax + (scalesMax - scalesMin) * 0.1),
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
