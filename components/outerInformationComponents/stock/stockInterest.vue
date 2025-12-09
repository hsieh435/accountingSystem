<template>
  <div style="width: 100%; height: 400px">
    <canvas id="earningsChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchStockDividendResult } from "@/server/outerWebApi.ts";
import { IStockPriceSearchingParams, IResponse } from "@/models/index.ts";
import { yearMonthDayTimeFormat } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), {
  searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }),
});

const dataLabels = ref<string[]>([]);
const cashEarningsData = ref<{ cashEarning: number; cashEarningDate: string }[]>([]);
const stockEarningsData = ref<{ stockEarning: number; stockEarningDate: string }[]>([]);

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
    console.log("fetchStockDividendResult:", res.data.data.data);
    if (res.data.data.data.length > 0) {
      dataLabels.value = res.data.data.data.map((stock: any) => {
        return stock.year;
      });
      cashEarningsData.value = res.data.data.data.map((stock: any) => {
        return { cashEarning: stock.CashEarningsDistribution, cashEarningDate: stock.CashDividendPaymentDate || "" };
      });
      stockEarningsData.value = res.data.data.data.map((stock: any) => {
        return {
          stockEarning: stock.StockEarningsDistribution,
          stockEarningDate: stock.StockExDividendTradingDate || "",
        };
      });
    } else {
      dataLabels.value = ["無資料"];
      cashEarningsData.value = [];
      stockEarningsData.value = [];
    }
    renderingChart();
    // console.log("dataLabels:", dataLabels.value);
    // console.log("cashEarningsData:", cashEarningsData.value);
    // console.log("stockEarningsData:", stockEarningsData.value);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function renderingChart() {
  // console.log(props.chartType);
  const earningsChart = document.getElementById("earningsChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = Math.max(
    ...[
      ...cashEarningsData.value.map((item) => item.cashEarning),
      ...stockEarningsData.value.map((item) => item.stockEarning),
    ],
  );
  // const aaaaa = [...cashEarningsData.value.map(item => item.cashEarningDate), ...stockEarningsData.value.map(item => item.stockEarningDate)];

  chartInstance = new Chart(earningsChart, {
    data: {
      datasets: [
        {
          type: "bar",
          label: "配息",
          data: cashEarningsData.value.map((item) => item.cashEarning),
        },
        {
          type: "bar",
          label: "配股",
          data: stockEarningsData.value.map((item) => item.stockEarning),
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
            footer: function (tooltipItems) {
              const index = tooltipItems[0].dataIndex;
              const cashDate = cashEarningsData.value[index]?.cashEarningDate || "N/A";
              const stockDate = stockEarningsData.value[index]?.stockEarningDate || "N/A";
              return (
                "除息日: " +
                yearMonthDayTimeFormat(cashDate, false) +
                "\n" +
                "除權日: " +
                yearMonthDayTimeFormat(stockDate, false)
              );
            },
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
