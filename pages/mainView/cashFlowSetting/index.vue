<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <span>查詢貨幣：</span>
      <currencySelect @sendbackCurrencyId="settingCurrency" />
      <ui-buttonGroup showCreate :createText="'新增現金流'" @dataCreate="cashFlowCreating()" :createDisable="!currencyId" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { ICashFlowList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "現金資料設定",
});



const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));



const currencyId = ref<string>("");
const cashFlowList = ref<ICashFlowList[]>([]);
const cashFlowListFiltered = ref<ICashFlowList[]>([]);
const tableData = ref<ICashFlowList[]>([]);



onMounted(() => {
  cashFlowSearching();
});



async function settingCurrency(currencyIdSendback: string) {
  currencyId.value = currencyIdSendback;
}



async function cashFlowSearching() {
  //
}



async function cashFlowCreating() {
  
}

</script>
<style lang="scss" scoped></style>
