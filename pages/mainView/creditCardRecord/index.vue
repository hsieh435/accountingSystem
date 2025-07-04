<template>
  <div class="flex justify-start items-center w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'creditCard'" :accountTypeName="'信用卡'" />

    <!-- <financeRecordComponents-creditCardRecord-creditCardTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICreditCardRecordList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "信用卡收支",
});


const creditCardTradeRecord = ref<ICreditCardRecordList[]>([]);

</script>
<style lang="scss" scoped></style>
