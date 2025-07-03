<template>
  <div class="flex items-center justify-center bg-gray-100">
    cashFlowTable
    <personalSettingComponents-cashFlowSetting-cashFlowData />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "現金資料設定",
})

</script>
<style lang="scss" scoped></style>
