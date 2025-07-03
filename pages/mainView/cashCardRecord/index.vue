<template>
  <div class="flex justify-start items-center bg-gray-100 w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'cashCard'" :accountTypeName="'儲值票卡'" />


    <!-- <financeRecordComponents-cashCardRecord-cashCardTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "儲值票卡收支",
})

</script>
<style lang="scss" scoped></style>
