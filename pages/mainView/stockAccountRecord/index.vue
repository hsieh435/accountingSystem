<template>
  <div class="flex justify-start items-center bg-gray-100 w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'stock'" :accountTypeName="'證券帳戶'" />




    <!-- <financeRecordComponents-stockAccountRecord-stockAccountTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "證券帳戶收支",
})

</script>
<style lang="scss" scoped></style>
