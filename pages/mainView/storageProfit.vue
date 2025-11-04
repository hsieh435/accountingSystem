<template>
  <div class="flex-col justify-start items-center">
    <div class="bg-gray-100 flex items-center px-3 py-1">
      <span>證券帳戶：</span>
      <accountSelect :selectTargetId="'isStaccountAble'" :sellectAll="false" @sendbackAccount="searchingStockStorage" />
    </div>
    <div class="flex justify-center items-center px-3 py-1" style="height: 200px">
      <canvas id="stockProfitChartOverall"></canvas>
    </div>
    <UAccordion
      :ui="{ label: 'mx-5', trailingIcon: 'mx-5', body: 'mx-5' }"
      :items="accordionItems"
      type="multiple"
      :unmount-on-hide="false"
      trailing-icon="i-lucide-arrow-down">
      <template #body="{ item }">
        <stockInvestmentChart
          :stockAccountIdGot="searchingParams.accountId"
          :stockNoGot="item.content"
          @stockDataConsolidate="caculateProfit" />
      </template>
    </UAccordion>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { fetchStockStorageProfitList } from "@/server/storageProfitApi.ts";
import { IStockAccountList, IStockStorageList, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import type { AccordionItem } from "@nuxt/ui";
import { Chart } from "chart.js/auto";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "庫存損益",
});

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const stockInvestmentChart = defineAsyncComponent(
  () => import("@/components/financeStatementComponents/stockInvestmentChart.vue"),
);

const accordionItems = ref<AccordionItem[]>([]);
const searchingParams = reactive<{ accountId: string }>({
  accountId: "",
});
const totalCostOverall = ref<number>(0);
const currentValueOverall = ref<number>(0);
const profitOverall = ref<number>(0);
const stockStorageChart = ref<Chart | null>(null);

async function searchingStockStorage(accountItem: IStockAccountList[]) {
  if (!accountItem[0]?.accountId) return;

  searchingParams.accountId = accountItem[0].accountId;

  try {
    const res: IResponse = await fetchStockStorageProfitList(accountItem[0].accountId);
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      accordionItems.value = res.data.data.map((item: IStockStorageList) => ({
        label: `${item.stockNo} / ${item.stockName}`,
        content: item.stockNo,
      }));
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function caculateProfit(data: { totalCost: number; currentValue: number; profit: number }) {
  // console.log("data:", data);
  totalCostOverall.value += data.totalCost;
  currentValueOverall.value += data.currentValue;
  profitOverall.value += data.profit;

  const ctx = (document.getElementById("stockProfitChartOverall") as HTMLCanvasElement).getContext("2d");
  if (ctx) {

    if (stockStorageChart.value) {
      stockStorageChart.value.destroy();
      stockStorageChart.value = null;
    }

    stockStorageChart.value = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [profitOverall.value > 0 ? "獲利" : "虧損"],
        datasets: [
          {
            label: profitOverall.value > 0 ? "獲利" : "虧損",
            data:
              profitOverall.value > 0
                ? [profitOverall.value, totalCostOverall.value - profitOverall.value]
                : [profitOverall.value * -1, totalCostOverall.value + profitOverall.value],
            borderColor: "white",
            backgroundColor: [profitOverall.value > 0 ? "red" : "green", "blue"],
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
            // text: doughnutChartTitle.value,
          },
        },
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
