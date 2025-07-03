<template>
  <div class="flex justify-start items-center bg-gray-100 w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'currencyAccount'" :accountTypeName="'存款帳戶'" />


    <!-- <financeRecordComponents-currencyAccountRecord-currencyAccountTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "存款帳戶收支",
})

</script>
<style lang="scss" scoped></style>
