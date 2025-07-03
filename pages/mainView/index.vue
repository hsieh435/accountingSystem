<template>
  <div>
    <!-- <span>abcdefghij</span> -->
    <!-- <span>00000000</span> -->

    <!-- <ui-select-tradeCategorySelect></ui-select-tradeCategorySelect> -->
    <!-- <ui-pagination></ui-pagination> -->

  </div>
</template>
<script setup lang="ts">
declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  breadcrumb: "首頁"
})

</script>
<style lang="scss" scoped></style>
