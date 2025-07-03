<template>
  <div class="flex justify-start items-center w-full">

    <personalSettingComponents-cashCardSetting-cashCardData />
    <personalSettingComponents-cashCardSetting-cashCardData :cashCardId="'123456'" />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, ref } from "vue";



declare function definePageMeta(meta: any): void;
definePageMeta({
  breadcrumb: "儲值票卡資料設定",
})


</script>
<style lang="scss" scoped></style>
