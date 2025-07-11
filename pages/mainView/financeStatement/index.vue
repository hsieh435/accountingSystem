<template>
  <div>
    <statisticalChart />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務報表",
  subTitle: "財務報表",
})



const statisticalChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/statisticalChart.vue"));



</script>
<style lang="scss" scoped></style>
