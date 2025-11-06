<template>
  <div class="flex-col justify-start items-center">
    <div class="bg-gray-100 flex items-center px-3 py-1 gap-x-5">
      <div class="flex items-center">
        <span>證券帳戶：</span>
        <accountSelect :selectTargetId="'isStaccountAble'" :sellectAll="false" @sendbackAccount="settingAccount" />
      </div>
      <div class="flex items-center">
        <span>證券帳戶：</span>
        <stockStorageSelect :accountIdGot="searchingParams.stockAccountId" :sellectAll="false" @sendbackStockNo="settingStockNo" />
      </div>
      <ui-buttonGroup showSearch @dataSearch="searchingStockStorage" :searchDisable="!searchingParams.stockAccountId || !searchingParams.stockNo" />
    </div>
    <template v-if="stockPurchaseRecord.length > 0">
      <UCarousel class="w-full max-w-xs mx-auto" :items="stockPurchaseRecord" auto-height arrows dots loop wheel-gestures>
        <template #item="{ item }">
          <stockProfitLineChart
            :searchingParamsGot="{ stockNo: item.stockNo, stockName: item.stockName, startDate: item.tradeDatetime, endDate: getCurrentYMD() }" />
        </template>
      </UCarousel>
    </template>
    <template v-else>
      <span>請選擇證券帳戶及股票以查詢獲利紀錄</span>
    </template>
    <!-- <UCarousel class="w-full max-w-xs mx-auto" :items="items" v-slot="{ item }" auto-height arrows dots loop wheel-gestures>
      <img :src="item" width="320" height="320" class="rounded-lg">
    </UCarousel> -->
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchEachStockStorageData } from "@/server/storageProfitApi.ts";
import { IStockAccountList, IStockAccountRecordList, IResponse } from "@/models/index";
import { getCurrentYMD } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";

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
const stockPurchaseRecord = ref<IStockAccountRecordList[]>([]);

const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/320?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/320?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/320?random=6'
]

onMounted(() => {
  // navigateTo("/mainView");
});

async function settingAccount(accountItem: IStockAccountList[]) {
  searchingParams.stockAccountId = accountItem[0]?.accountId || "";
}


async function settingStockNo(stockNo: string) {
  searchingParams.stockNo = stockNo;
}



async function searchingStockStorage() {
  stockPurchaseRecord.value = [];

  try {
    const res: IResponse = await fetchEachStockStorageData(searchingParams);
    if (res.data.returnCode === 0) {
      stockPurchaseRecord.value = res.data.data;
      console.log("stockPurchaseRecord:", stockPurchaseRecord.value);
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}



</script>
<style lang="scss" scoped></style>
