<template>
  <div class="flex justify-start items-center w-full">
    <personalSettingComponents-creditCardSetting-creditCardData />
    <personalSettingComponents-creditCardSetting-creditCardData />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";




declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "信用卡資料設定",
})

</script>
<style lang="scss" scoped></style>
