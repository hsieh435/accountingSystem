<template>
  <div class="flex justify-start items-center">
    <personalSettingComponents-stockAccountSetting-stockAccountData />
    <personalSettingComponents-stockAccountSetting-stockAccountData :stockAccountId="'123456'" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IStockAccountList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "證券帳戶資料設定",
})



const stockAccountList = ref<IStockAccountList[]>([]);


</script>
<style lang="scss" scoped></style>
