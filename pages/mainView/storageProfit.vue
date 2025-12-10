<template>
  <div class="flex-col justify-start items-center">
    <div class="bg-gray-100 flex gap-3 px-3 py-1">
      <div class="flex items-center">
        <span>證券帳戶：</span>
        <accountSelect :selectTargetId="'isStaccountAble'" :sellectAll="false" @sendbackAccount="settingAccountId" />
      </div>

      <ui-buttonGroup showSearch @dataSearch="searchingStockStorage" :searchDisable="!searchingParams.accountId" />
    </div>
    <template v-if="currentValueOverall > 0 && totalCostOverall > 0">
      <div class="flex justify-center mx-auto px-3 py-5" style="width: 80%">
        <div class="w-1/2 h-full grid grid-flow-col grid-rows-4 gap-2">
          <span class="text-lg font-bold my-5">庫存損益總覽</span>
          <div class="grid grid-cols-2">
            <span class="col-span-1 text-right">股票市值：</span>
            <span class="col-span-1">{{ currencyFormat(currentValueOverall) }} 元</span>
          </div>
          <div class="grid grid-cols-2">
            <span class="col-span-1 text-right">總成本：</span>
            <span class="col-span-1">{{ currencyFormat(totalCostOverall) }} 元</span>
          </div>
        </div>
        <div class="w-1/2 flex justify-center items-center px-3 py-1">
          <canvas id="stockProfitChartOverall"></canvas>
        </div>
      </div>
    </template>
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
import { fetchStockStorageProfitList } from "@/server/stockStorageProfitApi.ts";
import { IStockAccountList, IStockStorageList, IResponse } from "@/models/index.ts";
import { currencyFormat } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
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
const totalaccordion = ref<number>(0);
const totalCostOverall = ref<number>(0);
const currentValueOverall = ref<number>(0);
const profitOverall = ref<number>(0);
const stockStorageChart = ref<Chart | null>(null);

async function settingAccountId(accountItem: IStockAccountList) {
  searchingParams.accountId = accountItem.accountId;
}

async function searchingStockStorage() {
  try {
    const res: IResponse = await fetchStockStorageProfitList(searchingParams.accountId);
    console.log("res:", res.data.data);
    accordionItems.value = res.data.data.map((item: IStockStorageList) => ({
      label: `${item.stockNo} / ${item.stockName}`,
      content: item.stockNo,
    }));
    // console.log("accordionItems:", accordionItems.value);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function caculateProfit(totalCost: number, currentValue: number, profit: number) {
  // console.log("data:", totalCost, currentValue, profit);
  totalCostOverall.value += totalCost;
  currentValueOverall.value += currentValue;
  profitOverall.value += profit;
  totalaccordion.value += 1;

  if (accordionItems.value.length === 0 || totalaccordion.value !== accordionItems.value.length) return;

  // console.log("accordionItems:", accordionItems.value.length);
  // console.log("totalCostOverall:", totalCostOverall.value);
  // console.log("currentValueOverall:", currentValueOverall.value);
  // console.log("profitOverall:", profitOverall.value);

  const ctx = (document.getElementById("stockProfitChartOverall") as HTMLCanvasElement).getContext("2d");
  if (ctx) {
    if (stockStorageChart.value) {
      stockStorageChart.value.destroy();
      stockStorageChart.value = null;
    }

    stockStorageChart.value = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          profitOverall.value > 0
            ? `獲利 ${currencyFormat(Math.abs(profitOverall.value))} 元`
            : `虧損 ${currencyFormat(Math.abs(profitOverall.value))} 元`,
        ],
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            // text: doughnutChartTitle.value,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });
  }
}
</script>
<style lang="scss" scoped></style>
