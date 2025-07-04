<template>
  <div class="flex justify-start items-center">
    <personalSettingComponents-currencyAccountsSetting-currencyAccountsData />
    <personalSettingComponents-currencyAccountsSetting-currencyAccountsData :currencyAccountId="'123456'" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICurrencyAccountList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "存款帳戶資料設定",
})



const currencyAccountList = ref<ICurrencyAccountList[]>([]);



</script>
<style lang="scss" scoped></style>
