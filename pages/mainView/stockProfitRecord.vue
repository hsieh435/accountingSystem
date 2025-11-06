<template>
  <div class="flex-col justify-start items-center">
    <div class="bg-gray-100 flex items-center px-3 py-1 gap-x-5">
      <div class="flex items-center">
        <span>證券帳戶：</span>
        <accountSelect :selectTargetId="'isStaccountAble'" :sellectAll="false" @sendbackAccount="settingAccount" />
      </div>
      <div class="flex items-center">
        <span>證券帳戶：</span>
        <stockStorageSelect :accountIdGot="searchingParams.accountId" :sellectAll="false" @sendbackStockNo="settingStockNo" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { IStockAccountList, IStockStorageList, IResponse } from "@/models/index";
import type { AccordionItem } from "@nuxt/ui";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "獲利紀錄",
});

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const stockStorageSelect = defineAsyncComponent(() => import("@/components/ui/select/stockStorageSelect.vue"));



const searchingParams = reactive<{ accountId: string; stockNo: string }>({
  accountId: "",
  stockNo: "",
});



onMounted(() => {
  // navigateTo("/mainView");
});

async function settingAccount(accountItem: IStockAccountList[]) {
  searchingParams.accountId = accountItem[0]?.accountId || "";
}


async function settingStockNo(stockNo: string) {
  searchingParams.stockNo = stockNo;
  console.log("searchingParams:", searchingParams);
}



</script>
<style lang="scss" scoped></style>
