<template>
  <div class="flex justify-start items-center w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'currencyAccount'" :accountTypeName="'存款帳戶'" />

    <!-- <financeRecordComponents-currencyAccountRecord-currencyAccountTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IcurrencyAccountRecordList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "存款帳戶收支",
})


const currencyAccountRecord = ref<IcurrencyAccountRecordList[]>([]);

</script>
<style lang="scss" scoped></style>
