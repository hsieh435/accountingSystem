<template>
  <div class="flex justify-start items-center bg-gray-100 w-full">
    <financeRecordComponents-accountRecordSearching />




    <!-- <financeRecordComponents-cashFlowRecord-cashFlowTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "現金收支",
})

</script>
<style lang="scss" scoped></style>
