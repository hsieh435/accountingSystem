<template>
  <div class="flex justify-start items-center w-full">
    <financeRecordComponents-accountRecordSearching :accountTypeId="'cashCard'" :accountTypeName="'儲值票卡'" />

    <!-- <financeRecordComponents-cashCardRecord-cashCardTradeData /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashCardRecordList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "儲值票卡收支",
})



const cashCardTradeRecord = ref<ICashCardRecordList[]>([]);



</script>
<style lang="scss" scoped></style>
