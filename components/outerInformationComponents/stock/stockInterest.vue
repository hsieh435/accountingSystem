<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { fetchStockDividendResult } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IResponse } from "@/models/index";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";



const props = withDefaults(defineProps<{ searchingParamsGot: IStockPriceSearchingParams }>(), { searchingParamsGot: () => ({ stockNo: "", stockName: "", startDate: "", endDate: "" }) });


watch(props, () => {
  searchingStockPrice();
}, { deep: true });



async function searchingStockPrice() {
  console.log("searchingParams:", props.searchingParamsGot);
  try {
    const res: IResponse = await fetchStockDividendResult(props.searchingParamsGot);
    console.log("fetchStockDividendResult:", res.data.data);
    if (res.data.returnCode === 0) {
      // stockPriceRecord.value = res.data.data.data;

      // if (stockPriceRecord.value.length > 0) {
      //   stockDataLineChart.value = [];
      //   lineChartTitle.value =
      //     props.searchingParamsGot.stockName + " " +
      //     props.searchingParamsGot.startDate.replace(/-/g, "/") + " ~ " +
      //     props.searchingParamsGot.endDate.replace(/-/g, "/") + "股價走勢";
      //   stockData.value = stockPriceRecord.value;
      //   stockDataLineChart.value = stockData.value.map((record) => {
      //     return {
      //       label: record.date.replace(/-/g, "/"),
      //       data: record.close,
      //     };
      //   });
      //   renderingChart();
      // } else {
      //   showAxiosToast({ message: "查無資料", icon: "warning" });
      // }
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}


</script>
<style lang="scss" scoped></style>
