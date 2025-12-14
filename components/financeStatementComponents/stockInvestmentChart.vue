<template>
  <div class="w-full flex px-20" style="height: 150px">
    <div class="w-3/5 text-base leading-6 grid grid-flow-col grid-rows-4 gap-4">
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">持有股數：</span>
        <span class="col-span-1">{{ currencyFormat(stockTotalQuantity) }} 股</span>
      </div>
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">市價：</span>
        <span class="col-span-1">{{ currencyFormat(stockLatestPrice) }} 元 / 股</span>
      </div>
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">購買均價：</span>
        <span class="col-span-1">{{ currencyFormat(stockAveragePrice) }} 元</span>
      </div>
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">成本：</span>
        <span class="col-span-1">{{ currencyFormat(stockTotalCost) }} 元</span>
      </div>
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">市值：</span>
        <span class="col-span-1">{{ currencyFormat(stockCurrentValue) }} 元</span>
      </div>
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">損益：</span>
        <span :class="['col-span-1', stockCurrentProfit >= 0 ? 'text-red-500' : 'text-green-500']"
          >{{ currencyFormat(stockCurrentProfit) }} 元</span
        >
      </div>
      <div class="grid grid-cols-2">
        <span class="col-span-1 text-right">損益：</span>
        <span :class="['col-span-1', stockCurrentProfit >= 0 ? 'text-red-500' : 'text-green-500']">
          {{ ((stockCurrentProfit / stockTotalCost) * 100).toFixed(2) }} %
        </span>
      </div>
    </div>
    <div class="w-2/5 flex justify-center items-center">
      <canvas :id="`stockInvestmentChart${props.stockNoGot}`"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { fetchEachStockStorageData } from "@/server/stockStorageProfitApi.ts";
import { fetchStockRangeValue } from "@/server/outerWebApi.ts";
import { IResponse } from "@/models/index.ts";
import { currencyFormat, dateMove, getCurrentYMD } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ stockAccountIdGot?: string; stockNoGot?: string }>(), {
  stockAccountIdGot: "",
  stockNoGot: "",
});
const emits = defineEmits(["stockDataConsolidate"]);

const doughnutChartTitle = ref<string>("");
const stockTotalCost = ref<number>(0);
const stockLatestPrice = ref<number>(0);
const stockTotalQuantity = ref<number>(0);
const stockAveragePrice = ref<number>(0);
const stockCurrentValue = ref<number>(0);
const stockCurrentProfit = ref<number>(0);
const stockInvestmentChart = ref<Chart | null>(null);

onMounted(async () => {
  // console.log("onMounted props:", props);
  await searchingLatestStockPrice();
  await searchingEachStockStorageData();
});

async function searchingLatestStockPrice() {
  // stockLatestPrice.value = 0;

  try {
    const res: IResponse = await fetchStockRangeValue({
      stockNo: props.stockNoGot,
      startDate: dateMove(getCurrentYMD(), -30),
      endDate: getCurrentYMD(),
    });
    // console.log("searchingLatestStockPrice:", res.data.data);
    if (res.data.data.data.length > 0) {
      stockLatestPrice.value = res.data.data.data[res.data.data.data.length - 1].close;
    } else {
      stockLatestPrice.value = 0;
    }
  } catch (error) {
    stockLatestPrice.value = 0;
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function searchingEachStockStorageData() {
  doughnutChartTitle.value = "";
  stockTotalCost.value = 0;
  stockTotalQuantity.value = 0;
  stockCurrentValue.value = 0;
  stockCurrentProfit.value = 0;
  if (!props.stockAccountIdGot || !props.stockNoGot) return;

  try {
    const res: IResponse = await fetchEachStockStorageData({
      stockAccountId: props.stockAccountIdGot,
      stockNo: props.stockNoGot,
    });
    // console.log("res:", res.data.data);
    doughnutChartTitle.value = `${res.data.data.stockNo} / ${res.data.data.stockName} 投資損益`;
    for (let i = 0; i < res.data.data.length; i++) {
      stockTotalCost.value += res.data.data[i].tradeTotalPrice;
      stockTotalQuantity.value += res.data.data[i].quantity;
    }
    stockAveragePrice.value = Math.round((stockTotalCost.value / stockTotalQuantity.value) * 100) / 100;
    stockCurrentValue.value = Math.round(stockLatestPrice.value * stockTotalQuantity.value);
    stockCurrentProfit.value = stockCurrentValue.value - stockTotalCost.value;

    // if (stockLatestPrice.value === 0 || stockCurrentValue.value === 0) return;
    emits("stockDataConsolidate", stockTotalCost.value, stockCurrentValue.value, stockCurrentProfit.value);

    const stockData = res.data.data;
    if (stockData) {
      const ctx = (document.getElementById(`stockInvestmentChart${props.stockNoGot}`) as HTMLCanvasElement).getContext(
        "2d",
      );
      if (ctx) {
        if (stockInvestmentChart.value) {
          stockInvestmentChart.value.destroy();
          stockInvestmentChart.value = null;
        }

        stockInvestmentChart.value = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: [stockCurrentProfit.value > 0 ? "獲利" : "虧損"],
            datasets: [
              {
                label: stockCurrentProfit.value > 0 ? "獲利" : "虧損",
                data:
                  stockCurrentProfit.value > 0
                    ? [stockCurrentProfit.value, stockTotalCost.value - stockCurrentProfit.value]
                    : [stockCurrentProfit.value * -1, stockTotalCost.value + stockCurrentProfit.value],
                borderColor: "white",
                backgroundColor: [stockCurrentProfit.value > 0 ? "red" : "green", "blue"],
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
                text: doughnutChartTitle.value,
              },
              tooltip: {
                enabled: false,
              },
            },
          },
        });
      }
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
