<template>
  <div>
    <div class="w-full bg-gray-100 flex flex-wrap justify-start items-center px-3 py-1">
      <div class="flex items-center me-3 my-1">
        <span>證券帳戶：</span>
        <accountSelect :selectTargetId="'isStaccountAble'" :sellectAll="false" @sendbackAccount="settingAccountId" />
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
        <canvas id="stockAccountIncomeChart"></canvas>
      </div>
      <div style="width: 40%; height: 400px">
        <canvas id="stockAccountExpenseChart"></canvas>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { fetchStockAccountRecordList } from "@/server/stockAccountRecordApi";
import { IFinanceRecordSearchingParams, IStockAccountRecordList, IStockAccountList, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat } from "@/composables/tools";
import { messageToast } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const incomePieChartTitle = ref<string>("");
const expensePieChartTitle = ref<string>("");
const incomeDataPieChart = ref<{ tradeName: string; tradeTotalPrice: number }[]>([]);
const expenseDataPieChart = ref<{ tradeName: string; tradeTotalPrice: number }[]>([]);
const incomeChartInstance = ref<Chart | null>(null);
const expenseChartInstance = ref<Chart | null>(null);

const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});

async function settingAccountId(accountItem: IStockAccountList) {
  searchParams.accountId = accountItem?.accountId || "";
  searchParams.currencyId = accountItem?.currency || "";
}

async function settingSettingDate(dateSendback: string) {
  searchParams.startingDate = dateSendback + " 00:00:00.001";
}

async function settingEndDate(dateSendback: string) {
  searchParams.endDate = dateSendback + " 23:59:59.999";
}

async function settingSearchingParams() {
  try {
    const res: IResponse = await fetchStockAccountRecordList(searchParams);
    // console.log("res:", res.data.data);
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

    const stockAccountIncomeChart = document.getElementById("stockAccountIncomeChart") as HTMLCanvasElement;
    const stockAccountExpenseChart = document.getElementById("stockAccountExpenseChart") as HTMLCanvasElement;

    await renderingChart(
      stockAccountIncomeChart,
      incomeDataPieChart.value.length > 0 ? incomeDataPieChart.value : [{ tradeName: "無資料", tradeTotalPrice: 0 }],
      incomePieChartTitle.value,
      incomeChartInstance,
    );
    await renderingChart(
      stockAccountExpenseChart,
      expenseDataPieChart.value.length > 0 ? expenseDataPieChart.value : [{ tradeName: "無資料", tradeTotalPrice: 0 }],
      expensePieChartTitle.value,
      expenseChartInstance,
    );
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function renderingChart(
  chartId: HTMLCanvasElement,
  usingData: { tradeName: string; tradeTotalPrice: number }[],
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
  const values = usingData.map((item) => item.tradeTotalPrice);

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

async function aggregateData(data: IStockAccountRecordList[], filterType: string) {
  const resultMap: Record<string, number> = {};
  let recordList = JSON.parse(JSON.stringify(data));
  if (filterType === "income") {
    recordList = recordList.filter((item: IStockAccountRecordList) => item.transactionType === "income");
  } else if (filterType === "expense") {
    recordList = recordList.filter((item: IStockAccountRecordList) => item.transactionType === "expense");
  }

  recordList.forEach((item: IStockAccountRecordList) => {
    const { tradeName, tradeTotalPrice } = item;
    if (typeof tradeName === "string") {
      resultMap[tradeName] = (resultMap[tradeName] || 0) + tradeTotalPrice;
    }
  });

  return Object.entries(resultMap).map(([tradeName, tradeTotalPrice]) => ({
    tradeName,
    tradeTotalPrice,
  }));
}
</script>
<style lang="scss" scoped></style>
