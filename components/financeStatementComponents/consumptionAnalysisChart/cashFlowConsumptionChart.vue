<template>
  <div>
    <consumptionSearching
      :accountTypeId="props.accountTypeId"
      :accountTypeName="props.accountTypeName"
      @sendbackSearchingParams="settingSearchingParams" />
    <div style="width: 90%; height: 400px">
      <canvas id="cashFlowConsumptionChart"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import { fetchCashFlowRecordList } from "@/server/cashFlowRecordApi";
import { IFinanceRecordSearchingParams, ICashFlowRecordList, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const consumptionSearching = defineAsyncComponent(
  () => import("@/components/financeStatementComponents/consumptionAnalysisChart/consumptionSearching.vue"),
);

const props = withDefaults(defineProps<{ accountTypeId?: string; accountTypeName?: string }>(), {
  accountTypeId: "",
  accountTypeName: "請選擇",
});

const pieChartTitle = ref<string>("");
const stockDataLineChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const cashFlowConsumptionChart = ref<Chart | null>(null);
let chartInstance: Chart | null = null;

watch(cashFlowConsumptionChart, (newChart) => {
  if (newChart) {
    newChart.update();
  }
});

async function settingSearchingParams(params: IFinanceRecordSearchingParams) {
  // console.log("params:", params);
  try {
    const res: IResponse = await fetchCashFlowRecordList(params);
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      pieChartTitle.value =
        // props.accountTypeName +
        // " " +
        params.startingDate.replace(/-/g, "/") + " ~ " + params.endDate.replace(/-/g, "/") + " 消費分析";

      if (res.data.data.length > 0) {
        stockDataLineChart.value = aggregateData(res.data.data);
        // console.log("stockDataLineChart:", stockDataLineChart.value);
        renderingChart();
      } else {
        return;
      }
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

function renderingChart() {
  const cashFlowConsumptionChart = document.getElementById("cashFlowConsumptionChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // console.log("getLabels:", getLabels(stockDataLineChart.value));
  // console.log("getData:", getData(stockDataLineChart.value));
  const labels = stockDataLineChart.value.map((item) => item.tradeName);
  const values = stockDataLineChart.value.map((item) => item.tradeAmount);

  chartInstance = new Chart(cashFlowConsumptionChart, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          // backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: pieChartTitle.value,
        },
      },
      maintainAspectRatio: false,
    },
  });
}

function aggregateData(data: ICashFlowRecordList[]) {
  const resultMap: Record<string, number> = {};

  data.forEach((item) => {
    const { tradeName, tradeAmount } = item;
    if (typeof tradeName === "string") {
      resultMap[tradeName] = (resultMap[tradeName] || 0) + tradeAmount;
    }
  });

  return Object.entries(resultMap).map(([tradeName, tradeAmount]) => ({
    tradeName,
    tradeAmount,
  }));
}
</script>
<style lang="scss" scoped></style>
