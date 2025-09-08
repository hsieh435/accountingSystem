<template>
  <div style="width: 100%; height: 400px">
    <canvas id="myChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchStockDividendResult } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IResponse } from "@/models/index";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), {
  searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }),
});


let stockDataLineChart = ref<{ label: string; data: number }[]>([]);
const stockDividendList = ref<any[]>([]);



watch(props, () => {
  searchingStockInterest();
}, { deep: true });

async function searchingStockInterest() {
  // console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockDividendResult(props.searchingParamsGot);
    console.log("fetchStockDividendResult:", res.data.data.data);
    console.log("length:", res.data.data.data.length);
    if (res.data.returnCode === 0) {
      stockDividendList.value = res.data.data.data;
      if (stockDividendList.value.length > 0) {
        stockDataLineChart.value = [];
      //   lineChartTitle.value =
      //     props.searchingParamsGot.stockName + " " +
      //     props.searchingParamsGot.startDate.replace(/-/g, "/") + " ~ " +
      //     props.searchingParamsGot.endDate.replace(/-/g, "/") + "股價走勢";
      //   stockDataLineChart.value = stockData.value.map((record) => {
      //     return {
      //       label: record.date.replace(/-/g, "/"),
      //       data: record.close,
      //     };
      //   });
      //   renderingChart();



      //
      // CashEarningsDistribution：配息
      // StockEarningsDistribution：配股
      //
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
async function renderingChart() {
  // console.log(props.chartType);
  const myChart = document.getElementById("myChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(myChart, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "",
          data: [],
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
</script>
<style lang="scss" scoped></style>
<!-- https://www.chartjs.org/docs/latest/charts/mixed.html -->
