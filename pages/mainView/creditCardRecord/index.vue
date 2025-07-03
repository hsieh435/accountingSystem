<template>
  <div class="flex justify-start items-center bg-gray-100 w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'creditCard'" :accountTypeName="'信用卡'" />




    <!-- <financeRecordComponents-creditCardRecord-creditCardTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "信用卡收支",
})

</script>
<style lang="scss" scoped></style>
