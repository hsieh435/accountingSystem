<template>
  <div class="flex justify-center items-center">
    <parameterSettingComponents-tradeTypeComponents-tradeTypeData />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
})



</script>
<style lang="scss" scoped></style>
