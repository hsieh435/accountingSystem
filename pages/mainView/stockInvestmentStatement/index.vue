<template>
  <div>
    <stockInvestmentChart></stockInvestmentChart>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "證券投資報表",
})



const stockInvestmentChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/stockInvestmentChart.vue"));


</script>
<style lang="scss" scoped></style>
