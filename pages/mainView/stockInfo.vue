<template>
  <div class="flex-col justify-start items-center">
    <stockSearching />
  </div>
  <div class="px-3">
    <!--  -->
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { fetchStockList } from "@/server/outerWebApi";
import { ISelectData, ICurrencyList, IResponse } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
});

const stockSearching = defineAsyncComponent(() => import("@/components/outerInformationComponents/stock/stockSearching.vue"));


</script>
<style lang="scss" scoped></style>
