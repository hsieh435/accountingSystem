<template>
  <div></div>
</template>
<script setup lang="ts">
declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  breadcrumb: "首頁"
})

</script>
<style lang="scss" scoped></style>
