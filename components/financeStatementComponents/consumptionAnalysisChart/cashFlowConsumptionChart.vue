<template>
  <div>
    <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
      <div class="flex items-center me-3 my-1">
        <span>現金流：</span>
        <accountSelect :selectTargetId="'isCashflowAble'" :selectTitle="'現金流'" @sendbackAccount="settingAccountId" />
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
    <div class="flex justify-between items-center my-3">
      <div style="width: 40%; height: 400px">
        <canvas id="cashFlowIncomeChart"></canvas>
      </div>
      <div style="width: 40%; height: 400px">
        <canvas id="cashFlowExpenseChart"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, watch } from "vue";
import { fetchCashFlowRecordList } from "@/server/cashFlowRecordApi";
import { IFinanceRecordSearchingParams, ICashFlowRecordList, ICashFlowList, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const incomePieChartTitle = ref<string>("");
const expensePieChartTitle = ref<string>("");
const incomeDataPieChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const expenseDataPieChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const cashFlowIncomeChart = ref<Chart | null>(null);
const cashFlowExpenseChart = ref<Chart | null>(null);
let incomeChartInstance: Chart | null = null;
let expenseChartInstance: Chart | null = null;

const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});

watch(cashFlowIncomeChart, (newChart) => {
  if (newChart) {
    newChart.update();
  }
});
watch(cashFlowExpenseChart, (newChart) => {
  if (newChart) {
    newChart.update();
  }
});

async function settingAccountId(accountItem: ICashFlowList[]) {
  searchParams.accountId = accountItem[0]?.cashflowId || "";
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
    const res: IResponse = await fetchCashFlowRecordList(searchParams);
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      incomePieChartTitle.value =
        yearMonthDayTimeFormat(searchParams.startingDate, false) +
        " ~ " +
        yearMonthDayTimeFormat(searchParams.endDate, false) +
        " 消費分析";
      expensePieChartTitle.value =
        yearMonthDayTimeFormat(searchParams.startingDate, false) +
        " ~ " +
        yearMonthDayTimeFormat(searchParams.endDate, false) +
        "收入分析";

      if (res.data.data.length > 0) {
        incomeDataPieChart.value = await aggregateData(res.data.data, "income");
        expenseDataPieChart.value = await aggregateData(res.data.data, "expense");

        const cashFlowIncomeChart = document.getElementById("cashFlowIncomeChart") as HTMLCanvasElement;
        const cashFlowExpenseChart = document.getElementById("cashFlowExpenseChart") as HTMLCanvasElement;
        await renderingChart(
          cashFlowIncomeChart,
          incomeDataPieChart.value,
          incomePieChartTitle.value,
          incomeChartInstance,
        );
        await renderingChart(
          cashFlowExpenseChart,
          expenseDataPieChart.value,
          expensePieChartTitle.value,
          expenseChartInstance,
        );
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

async function renderingChart(
  chartId: HTMLCanvasElement,
  usingData: { tradeName: string; tradeAmount: number }[],
  chartTitle: string,
  instance: Chart | null,
) {
  console.log("chartId:", chartId);
  console.log("usingData:", usingData);
  console.log("chartTitle:", chartTitle);

  if (instance) {
    instance.destroy();
    instance = null;
  }

  const labels = usingData.map((item) => item.tradeName);
  const values = usingData.map((item) => item.tradeAmount);

  instance = new Chart(chartId, {
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
          text: chartTitle,
        },
      },
      maintainAspectRatio: false,
    },
  });
}

async function aggregateData(data: ICashFlowRecordList[], filterType: string) {
  const resultMap: Record<string, number> = {};
  let recordList = JSON.parse(JSON.stringify(data));
  if (filterType === "income") {
    recordList = recordList.filter((item: ICashFlowRecordList) => item.transactionType === "income");
  } else if (filterType === "expense") {
    recordList = recordList.filter((item: ICashFlowRecordList) => item.transactionType === "expense");
  }

  recordList.forEach((item: ICashFlowRecordList) => {
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
