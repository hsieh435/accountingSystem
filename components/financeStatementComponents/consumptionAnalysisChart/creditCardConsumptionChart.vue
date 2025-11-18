<template>
  <div>
    <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
      <div class="flex items-center me-3 my-1">
        <span>信用卡：</span>
        <accountSelect :selectTargetId="'isCreditcardAble'" :sellectAll="false" @sendbackAccount="settingAccountId" />
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
      <canvas id="creditCardConsumptionChart"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { fetchCreditCardRecordList } from "@/server/creditCardRecordApi";
import { IFinanceRecordSearchingParams, ICreditCardRecordList, ICreditCardList, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat } from "@/composables/tools";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const incomePieChartTitle = ref<string>("");
const incomeDataPieChart = ref<{ tradeName: string; tradeAmount: number }[]>([]);
const chartInstanceRef = ref<Chart | null>(null);

const searchParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
});

async function settingAccountId(accountItem: ICreditCardList[]) {
  searchParams.accountId = accountItem[0]?.creditcardId || "";
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
    const res: IResponse = await fetchCreditCardRecordList(searchParams);
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      incomePieChartTitle.value =
        yearMonthDayTimeFormat(searchParams.startingDate, false) +
        " ~ " +
        yearMonthDayTimeFormat(searchParams.endDate, false) +
        " 消費分析";

      incomeDataPieChart.value = await aggregateData(res.data.data);
      const creditCardConsumptionChart = document.getElementById("creditCardConsumptionChart") as HTMLCanvasElement;

      await renderingChart(
        creditCardConsumptionChart,
        incomeDataPieChart.value.length > 0 ? incomeDataPieChart.value : [{ tradeName: "無資料", tradeAmount: 0 }],
        incomePieChartTitle.value,
        chartInstanceRef,
      );
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
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

async function aggregateData(data: ICreditCardRecordList[]) {
  const resultMap: Record<string, number> = {};
  let recordList = JSON.parse(JSON.stringify(data));

  recordList.forEach((item: ICreditCardRecordList) => {
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
