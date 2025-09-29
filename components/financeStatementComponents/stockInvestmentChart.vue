<template>
  <div style="width: 100%; height: 400px">
    <canvas id="stockInvestmentChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { fetchCurrencyHistoryExRate } from "@/server/outerWebApi";
import { ICurrencyExRateSearchingParams, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import { Chart } from "chart.js/auto";

const stockInvestmentChart = ref<Chart | null>(null);

watch(stockInvestmentChart, (newChart) => {
  if (newChart) {
    newChart.update();
  }
});
</script>
<style lang="scss" scoped></style>
