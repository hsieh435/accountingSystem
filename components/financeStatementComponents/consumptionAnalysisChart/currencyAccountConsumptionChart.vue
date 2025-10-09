<template>
  <div>
    <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
      <div class="flex items-center me-3 my-1">
        <span>存款帳戶：</span>
        <accountSelect
          :selectTargetId="'isCuaccountAble'"
          :selectTitle="'存款帳戶'"
          @sendbackAccount="settingAccountId" />
      </div>

      <span>時間區間：</span>
      <dateSelect
        :dateSelect="searchParams.startingDate"
        :maxDate="searchParams.endDate"
        @sendbackDate="settingSettingDate" />
      <span class="mx-1">～</span>
      <dateSelect
        :dateSelect="searchParams.endDate"
        :minDate="searchParams.startingDate"
        @sendbackDate="settingEndDate" />

      <ui-buttonGroup
        showSearch
        :searchDisable="!searchParams.accountId || !searchParams.startingDate || !searchParams.endDate"
        @dataSearch="settingSearchingParams()" />
    </div>
    <div style="width: 90%; height: 400px">
      <canvas id="currencyAccountConsumptionChart"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import { fetchCurrencyAccountRecordList } from "@/server/currencyAccountRecordApi";
import {
  IFinanceRecordSearchingParams,
  IcurrencyAccountRecordList,
  ICurrencyAccountList,
  IResponse,
} from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const pieChartTitle = ref<string>("");
const stockDataLineChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const currencyAccountConsumptionChart = ref<Chart | null>(null);
let chartInstance: Chart | null = null;

const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});

watch(currencyAccountConsumptionChart, (newChart) => {
  if (newChart) {
    newChart.update();
  }
});

async function settingAccountId(accountItem: ICurrencyAccountList[]) {
  searchParams.accountId = accountItem[0]?.accountId || "";
  searchParams.currencyId = accountItem[0]?.currency || "";
}

async function settingSettingDate(dateSendback: string) {
  searchParams.startingDate = dateSendback + " 00:00:00.001";
}

async function settingEndDate(dateSendback: string) {
  searchParams.endDate = dateSendback + " 23:59:59.999";
}

async function settingSearchingParams() {
  try {
    const res: IResponse = await fetchCurrencyAccountRecordList(searchParams);
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      pieChartTitle.value =
        yearMonthDayTimeFormat(searchParams.startingDate, false) +
        " ~ " +
        yearMonthDayTimeFormat(searchParams.endDate, false) +
        " 消費分析";

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
  const currencyAccountConsumptionChart = document.getElementById("currencyAccountConsumptionChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // console.log("getLabels:", getLabels(stockDataLineChart.value));
  // console.log("getData:", getData(stockDataLineChart.value));
  const labels = stockDataLineChart.value.map((item) => item.tradeName);
  const values = stockDataLineChart.value.map((item) => item.tradeAmount);

  chartInstance = new Chart(currencyAccountConsumptionChart, {
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

function aggregateData(data: IcurrencyAccountRecordList[]) {
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
