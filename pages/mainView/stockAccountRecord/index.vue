<template>
  <div class="flex justify-start items-center w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'stockAccount'" :accountTypeName="'證券帳戶'" />

    <!-- <financeRecordComponents-stockAccountRecord-stockAccountTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IStockAccountRecordList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "證券帳戶收支",
})



const stockAccountRecord = ref<IStockAccountRecordList[]>([]);

</script>
<style lang="scss" scoped></style>
