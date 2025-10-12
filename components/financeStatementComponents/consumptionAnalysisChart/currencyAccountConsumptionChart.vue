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
    <div class="flex justify-center items-center gap-3">
      <div style="width: 40%; height: 400px">
        <canvas id="currencyAccountIncomeChart"></canvas>
      </div>
      <div style="width: 40%; height: 400px">
        <canvas id="currencyAccountExpenseChart"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
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

const incomePieChartTitle = ref<string>("");
const expensePieChartTitle = ref<string>("");
const incomeDataPieChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const expenseDataPieChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const incomeChartInstance = ref<Chart | null>(null);
const expenseChartInstance = ref<Chart | null>(null);

const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
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
      incomePieChartTitle.value =
        yearMonthDayTimeFormat(searchParams.startingDate, false) +
        " ~ " +
        yearMonthDayTimeFormat(searchParams.endDate, false) +
        " 收入分析";
      expensePieChartTitle.value =
        yearMonthDayTimeFormat(searchParams.startingDate, false) +
        " ~ " +
        yearMonthDayTimeFormat(searchParams.endDate, false) +
        " 消費分析";

      incomeDataPieChart.value = await aggregateData(res.data.data, "income");
      expenseDataPieChart.value = await aggregateData(res.data.data, "expense");
      const currencyAccountIncomeChart = document.getElementById("currencyAccountIncomeChart") as HTMLCanvasElement;
      const currencyAccountExpenseChart = document.getElementById("currencyAccountExpenseChart") as HTMLCanvasElement;

      await renderingChart(
        currencyAccountIncomeChart,
        incomeDataPieChart.value.length > 0 ? incomeDataPieChart.value : [{ tradeName: "無資料", tradeAmount: 0 }],
        incomePieChartTitle.value,
        incomeChartInstance,
      );
      await renderingChart(
        currencyAccountExpenseChart,
        expenseDataPieChart.value.length > 0 ? expenseDataPieChart.value : [{ tradeName: "無資料", tradeAmount: 0 }],
        expensePieChartTitle.value,
        expenseChartInstance,
      );
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

// Accept chartInstance as a ref and update it after destroying/creating
async function renderingChart(
  chartId: HTMLCanvasElement,
  usingData: { tradeName: string; tradeAmount: number }[],
  chartTitle: string,
  chartInstanceRef: { value: Chart | null },
) {
  // console.log("chartId:", chartId);
  // console.log("usingData:", usingData);
  // console.log("chartTitle:", chartTitle);

  if (chartInstanceRef.value) {
    chartInstanceRef.value.destroy();
    chartInstanceRef.value = null;
  }

  const labels = usingData.map((item) => item.tradeName);
  const values = usingData.map((item) => item.tradeAmount);

  chartInstanceRef.value = new Chart(chartId, {
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

async function aggregateData(data: IcurrencyAccountRecordList[], filterType: string) {
  const resultMap: Record<string, number> = {};
  let recordList = JSON.parse(JSON.stringify(data));
  if (filterType === "income") {
    recordList = recordList.filter((item: IcurrencyAccountRecordList) => item.transactionType === "income");
  } else if (filterType === "expense") {
    recordList = recordList.filter((item: IcurrencyAccountRecordList) => item.transactionType === "expense");
  }

  recordList.forEach((item: IcurrencyAccountRecordList) => {
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
