<template>
  <div class="flex justify-start items-center w-full">
    <personalSettingComponents-creditCardSetting-creditCardData />
    <personalSettingComponents-creditCardSetting-creditCardData :creditCardId="'123456'" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICreditCardList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "信用卡資料設定",
})



const creditCardList = ref<ICreditCardList[]>([]);

</script>
<style lang="scss" scoped></style>
