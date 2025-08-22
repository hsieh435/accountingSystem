<template>
  <div class="flex-col justify-start items-center">
    <stockSearching @sendbackSearchingData="settingstockinfo" />
  </div>
  <div class="px-3">
    <!--  -->
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { fetchStockList } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IStockPriceRecordList, IResponse, ISelectData, ICurrencyList } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import type { NuxtPlotlyHTMLElement } from 'nuxt-plotly';



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
});

const stockSearching = defineAsyncComponent(() => import("@/components/outerInformationComponents/stock/stockSearching.vue"));




async function settingstockinfo(searchingParams: IStockPriceSearchingParams, stockPriceRecord: IStockPriceRecordList[]) {
  // console.log(searchingParams);
  // console.log(stockPriceRecord);
}


</script>
<style lang="scss" scoped></style>
