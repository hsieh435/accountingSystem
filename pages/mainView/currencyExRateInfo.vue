<template>
  <div class="flex-col justify-start items-center">
    <div>
      <currencyExRateSearching />
    </div>
    <div class="px-3">
      <div></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { fetchCurrencyLatestExRate } from "@/server/outerWebApi";
import { IResponse } from "@/models/index";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "貨幣匯率查詢",
})



const currencyExRateSearching = defineAsyncComponent(() => import("@/components/outerInformationComponents/currency/currencyExRateSearching.vue"));



onMounted(async () => {
  //
});


</script>
<style lang="scss" scoped></style>
