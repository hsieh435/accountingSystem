<template>
  <div class="w-full flex px-20" style="height: 200px">
    <div class="w-full text-base leading-8 flex flex-col justify-start items-start border-1">
      <div class="w-full grid grid-cols-5">
        <span class="col-span-2 text-right">市價：</span>
        <span class="col-span-3">市價：</span>
      </div>
      <div class="w-full grid grid-cols-5">
        <span class="col-span-2 text-right">均價：</span>
        <span class="col-span-3">均價：</span>
      </div>
      <div class="w-full grid grid-cols-5">
        <span class="col-span-2 text-right">持有股數：</span>
        <span class="col-span-3">持有股數：</span>
      </div>
    </div>
    <div class="flex justify-center items-center ms-auto">
      <canvas :id="`stockInvestmentChart${props.stockNoGot}`"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchEachStockStorageData } from "@/server/storageProfitApi.ts";
import { fetchStockRangeValue } from "@/server/outerWebApi.ts";
import { IResponse } from "@/models/index";
import { dateMove, getCurrentYMD } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<{ stockAccountIdGot?: string; stockNoGot?: string }>(), {
  stockAccountIdGot: "",
  stockNoGot: "",
});

const doughnutChartTitle = ref<string>("");
const stockTotalCost = ref<number>(0);
const stockLatestPrice = ref<number>(0);
const stockTotalQuantity = ref<number>(0);
const stockCurrentValue = ref<number>(0);
const stockCurrentProfit = ref<number>(0);
const stockInvestmentChart = ref<Chart | null>(null);

onMounted(async () => {
  // console.log("onMounted props:", props);
  await searchingLatestStockPrice();
  await searchingEachStockStorageData();
});

// watch(props, () => {
//   console.log("watch props:", props);
//   searchingLatestStockPrice();
//   searchingEachStockStorageData();
// });

// watch(stockInvestmentChart, (newChart) => {
//   if (newChart) {
//     newChart.update();
//   }
// });

async function searchingLatestStockPrice() {
  stockLatestPrice.value = 0;

  try {
    const res: IResponse = await fetchStockRangeValue({
      stockNo: props.stockNoGot,
      startDate: dateMove(getCurrentYMD(), -30),
      endDate: getCurrentYMD(),
    });
    // console.log("searchingLatestStockPrice:", res.data.data.data);
    if (res.data.data.data.length > 0) {
      stockLatestPrice.value = res.data.data.data[res.data.data.data.length - 1].close;
    } else {
      stockLatestPrice.value = 0;
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
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
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      doughnutChartTitle.value = `${res.data.data[0].stockNo} / ${res.data.data[0].stockName} 投資損益`;
      for (let i = 0; i < res.data.data.length; i++) {
        stockTotalCost.value += res.data.data[i].tradeTotalPrice;
        stockTotalQuantity.value += res.data.data[i].quantity;
      }
      stockCurrentValue.value = Math.round(stockLatestPrice.value) * Math.round(stockTotalQuantity.value);
      stockCurrentProfit.value = stockCurrentValue.value - stockTotalCost.value;

      // console.log("stockLatestPrice:", stockLatestPrice.value);
      // console.log("stockTotalCost:", stockTotalCost.value);
      // console.log("stockTotalQuantity:", stockTotalQuantity.value);
      // console.log("stockCurrentValue:", stockCurrentValue.value);
      // console.log("stockCurrentProfit:", stockCurrentProfit.value);

      if (stockLatestPrice.value === 0 || stockCurrentValue.value === 0) return;

      const stockData = res.data.data;
      if (stockData) {
        const ctx = (
          document.getElementById(`stockInvestmentChart${props.stockNoGot}`) as HTMLCanvasElement
        ).getContext("2d");
        if (ctx) {
          stockInvestmentChart.value = new Chart(ctx, {
            type: "doughnut",
            data: {
              // labels: "",
              datasets: [
                {
                  // label: "",
                  data:
                    stockCurrentProfit.value > 0
                      ? [stockTotalCost.value - stockCurrentProfit.value, stockCurrentProfit.value]
                      : [stockCurrentProfit.value * -1, stockTotalCost.value + stockCurrentProfit.value],
                  borderColor: "white",
                  backgroundColor:
                  [stockCurrentProfit.value > 0 ? "blue" : "green", stockCurrentProfit.value > 0 ? "red" : "blue"],
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
              },
            },
          });
        }
      }
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
