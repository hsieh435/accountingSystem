<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>股票：</span><stockListSelect @sendbackStockNo="settingStockNo" />
    </div>
    <div class="flex items-center me-3 my-1">
      <span>查詢區間：</span>
      <yearMonthSelect :hasRange="true" :maxYear="searchingParams.endYear" :maxMonth="searchingParams.endMonth" @sendbackYearMonth="settingStart" />
      <span class="mx-1">～</span>
      <yearMonthSelect :hasRange="true" :maxYear="searchingParams.endYear" :maxMonth="searchingParams.endMonth" :minYear="searchingParams.startYear" :minMonth="searchingParams.startMonth" @sendbackYearMonth="settingEnd" />
    </div>
    <ui-buttonGroup showSearch :searchDisable="!searchingParams.stockNo" @dataSearch="searchingStockPrice()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, ref } from "vue";
import { fetchStockRangeValue } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IStockPriceRecordList, IResponse } from "@/models/index";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

const emits = defineEmits(["sendbackSearchingData"]);

const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const yearMonthSelect = defineAsyncComponent(() => import("@/components/ui/select/yearMonthSelect.vue"));



const searchingParams = reactive<IStockPriceSearchingParams>({
  stockNo: "",
  startYear: getCurrentYear(),
  startMonth: getCurrentMonth(),
  endYear: getCurrentYear(),
  endMonth: getCurrentMonth(),
});
const stockPriceRecord = ref<IStockPriceRecordList[]>([]);



async function settingStockNo(stockNo: string) {
  searchingParams.stockNo = stockNo;
}

async function settingStart(year: number, month: number) {
  searchingParams.startYear = year;
  searchingParams.startMonth = month;
}

async function settingEnd(year: number, month: number) {
  searchingParams.endYear = year;
  searchingParams.endMonth = month;
}

async function searchingStockPrice() {
  // console.log(searchingParams);

  try {
    const res: IResponse = await fetchStockRangeValue(searchingParams);
    console.log("fetchStockRangeValue:", res.data.data);
    if (res.data.returnCode === 0) {
      stockPriceRecord.value = res.data.data;
      // emits("sendbackSearchingData", stockPriceRecord.value);
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
