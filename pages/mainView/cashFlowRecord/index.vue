<template>
  <div class="flex justify-start items-center w-full">
    <financeRecordComponents-accountRecordSearching />

    <!-- <financeRecordComponents-cashFlowRecord-cashFlowTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashFlowRecordList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "現金收支",
});



const cashFlowRecord = ref<ICashFlowRecordList[]>([]);



</script>
<style lang="scss" scoped></style>
