<template>
  <div class="flex justify-center items-center">
    <tradeTypeData />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
})



const tradeTypeData = defineAsyncComponent(() => import("@/components/parameterSettingComponents/tradeTypeComponents/tradeTypeData.vue"));



</script>
<style lang="scss" scoped></style>
