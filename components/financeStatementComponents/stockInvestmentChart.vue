<template>
  <div class="w-full flex justify-between" style="height: 200px">
    <div>
      <div>
        <div>
          <!--  -->
        </div>
      </div>
    </div>

    <div style="width: 50%; height: 200px">
      <canvas :id="`stockInvestmentChart${props.stockNoGot}`"></canvas>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
// import { fetchCurrencyHistoryExRate } from "@/server/outerWebApi";
import { fetchEachStockStorageData } from "@/server/storageProfitApi.ts";
import { IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";



const props = withDefaults(defineProps<{ stockAccountIdGot?: string; stockNoGot?: string }>(), {
  stockAccountIdGot: "",
  stockNoGot: "",
});



const stockInvestmentChart = ref<Chart | null>(null);



onMounted(() => {
  console.log("onMounted props:", props);
  searchingEachStockStorageData();
});

watch(props, () => {
  console.log("watch props:", props);
  searchingEachStockStorageData();
});

// watch(stockInvestmentChart, (newChart) => {
//   if (newChart) {
//     newChart.update();
//   }
// });



async function searchingEachStockStorageData() {
  if (!props.stockAccountIdGot || !props.stockNoGot) return;

  try {
    const res: IResponse = await fetchEachStockStorageData({
      stockAccountId: props.stockAccountIdGot,
      stockNo: props.stockNoGot
    });
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      const stockData = res.data.data.find(
        (item: any) => item.stockNo === props.stockNoGot,
      );
      if (stockData) {
        const ctx = (document.getElementById(`stockInvestmentChart${props.stockNoGot}`) as HTMLCanvasElement).getContext("2d");
        if (ctx) {
          stockInvestmentChart.value = new Chart(ctx, {
            type: "line",
            data: {
              labels: stockData.dates,
              datasets: [
                {
                  label: `${stockData.stockNo} ${stockData.stockName} 投資收益`,
                  data: stockData.profits,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
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
