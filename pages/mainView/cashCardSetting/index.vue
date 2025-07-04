<template>
  <div class="flex justify-start items-center w-full">

    <personalSettingComponents-cashCardSetting-cashCardData />
    <personalSettingComponents-cashCardSetting-cashCardData :cashCardId="'123456'" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashCardList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
})



const cashCardList = ref<ICashCardList[]>([]);


</script>
<style lang="scss" scoped></style>
