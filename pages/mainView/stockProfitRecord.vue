<template>
  <div class="flex-col justify-start items-center">
    <div class="bg-gray-100 flex items-center px-3 py-1 gap-x-5">
      <div class="flex items-center">
        <span>證券帳戶：</span>
        <accountSelect :selectTargetId="'isStaccountAble'" :sellectAll="false" @sendbackAccount="settingAccount" />
      </div>
      <div class="flex items-center">
        <span>存股：</span>
        <stockStorageSelect
          :accountIdGot="searchingParams.stockAccountId"
          sellectAll
          @sendbackStockNo="settingStockNo" />
      </div>
      <ui-buttonGroup
        showSearch
        @dataSearch="searchingStockStorage"
        :searchDisable="!searchingParams.stockAccountId || !searchingParams.stockNo" />
    </div>
    <div class="my-5" :class="stockPurchaseRecord.length > 0 ? 'w-4/5 mx-auto' : 'hidden'">
      <UCarousel :items="stockPurchaseRecord" auto-height arrows dots loop wheel-gestures v-slot="{ item }">
        <stockProfitLineChart
          :searchingParamsGot="{
            stockNo: item.stockNo,
            stockName: item.stockName,
            startDate: item.tradeDatetime,
            endDate: getCurrentYMD(),
          }"
          :purchasePrice="item.pricePerShare"
          :indexGot="item.index" />
      </UCarousel>
    </div>
    <template v-if="stockPurchaseRecord.length === 0">
      <!-- <div class="text-xl font-semibold flex justify-center my-2">請選擇證券帳戶及股票以查詢獲利紀錄</div> -->
      <div class="text-xl font-semibold flex justify-center my-2"></div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { fetchEachStockStorageData } from "@/server/stockStorageProfitApi.ts";
import { IStockAccountList, IStockAccountRecordList, IResponse } from "@/models/index.ts";
import { getCurrentYMD } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "獲利紀錄",
});

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));
const stockStorageSelect = defineAsyncComponent(() => import("@/components/ui/select/stockStorageSelect.vue"));
const stockProfitLineChart = defineAsyncComponent(
  () => import("@/components/financeStatementComponents/stockProfitLineChart.vue"),
);

const searchingParams = reactive<{ stockAccountId: string; stockNo: string }>({
  stockAccountId: "",
  stockNo: "",
});
const stockPurchaseRecord = ref<(IStockAccountRecordList & { index?: number })[]>([]);

async function settingAccount(accountItem: IStockAccountList) {
  searchingParams.stockAccountId = accountItem?.accountId || "";
}

async function settingStockNo(stockNo: string) {
  searchingParams.stockNo = stockNo;
}

async function searchingStockStorage() {
  stockPurchaseRecord.value = [];

  try {
    const res: IResponse = await fetchEachStockStorageData(searchingParams);
    stockPurchaseRecord.value = res.data.data;
    for (let i = 0; i < stockPurchaseRecord.value.length; i++) {
      stockPurchaseRecord.value[i].tradeDatetime = getCurrentYMD(stockPurchaseRecord.value[i].tradeDatetime);
      stockPurchaseRecord.value[i].index = i + 1;
    }
    // console.log("stockPurchaseRecord:", stockPurchaseRecord.value);
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
