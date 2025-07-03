<template>
  <div class="flex items-center justify-center bg-gray-100">
    <parameterSettingComponents-tradeTypeComponents-tradeTypeData />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "支出類型設定",
})


</script>
<style lang="scss" scoped></style>
