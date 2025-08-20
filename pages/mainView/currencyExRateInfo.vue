<template>
  <div class="flex-col justify-start items-center">
    <currencyExRateSearching />
  </div>
  <div class="px-3">
    <!--  -->
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { fetchCurrencyExRateInfoList } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IResponse } from "@/models/index";
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
  await searchingCurrencyExRateInfo();
});

async function searchingCurrencyExRateInfo() {

  try {
    const res: IResponse = await fetchCurrencyExRateInfoList();
    console.log("fetchCurrencyExRateInfoList:", res.data.data);
    if (res.data.returnCode === 0) {
      //
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

</script>
<style lang="scss" scoped></style>
