<template>
  <div style="width: 100%; height: 500px" class="border-1">
    <canvas :id="`stockProfitLineChart${props.searchingParamsGot.stockNo}${props.indexGot}`"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import { fetchStockRangeValue } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(
  defineProps<{ searchingParamsGot: IStockPriceSearchingParams; purchasePrice: number; indexGot: number }>(),
  {
    searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }),
  },
);

const lineChartTitle = ref<string>("");
const stockDataLineChart = ref<{ label: string; data: number }[]>([]);
let chartInstance: Chart | null = null;

onMounted(() => {
  console.log("onMounted props:", props);
  searchingStockPrice();
});

watch(() => props.searchingParamsGot, () => {
    console.log("watch props:", props);
    // searchingStockPrice();
  },
  { deep: true },
);

async function searchingStockPrice() {
  // console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockRangeValue(props.searchingParamsGot);
    console.log("fetchStockRangeValue:", res.data.data);
    if (res.data.returnCode === 0) {
      lineChartTitle.value =
        props.searchingParamsGot.stockName +
        "股價走勢" +
        "\n\n\n\n\n\n\n" +
        "買入日：" +
        props.searchingParamsGot.startDate.replace(/-/g, "/") +
        "\n\n\n\n\n\n\n" +
        " 買入價：" +
        props.purchasePrice.toFixed(2);
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
  const stockProfitLineChartStockNoIndex = document.getElementById(
    `stockProfitLineChart${props.searchingParamsGot.stockNo}${props.indexGot}`,
  ) as HTMLCanvasElement;

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
  let currentValue = 0;
  let lastValue = 0;

  chartInstance = new Chart(stockProfitLineChartStockNoIndex, {
    type: "line",
    data: {
      labels: getLabels(stockDataLineChart.value) ? getLabels(stockDataLineChart.value) : [],
      datasets: [
        {
          label: lineChartTitle.value,
          data: getData(stockDataLineChart.value),
          fill: { above: "red", below: "green", target: { value: props.purchasePrice } },
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
                "收盤價：" + currentValue +
                "\n" +
                "獲利：" +
                (((currentValue - props.purchasePrice) / props.purchasePrice) * 100).toFixed(2) + "%"
              );
            },
          },
          footerColor: function () {
            switch (true) {
              case currentValue > props.purchasePrice:
                return "rgb(255, 0, 0)";
              case currentValue < props.purchasePrice:
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
