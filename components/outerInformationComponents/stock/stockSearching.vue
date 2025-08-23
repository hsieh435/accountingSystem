<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>股票：</span><stockListSelect @sendbackStockNo="settingStockNo" />
    </div>
    <div class="flex items-center me-3 my-1">
      <span>查詢區間：</span>
      <yearMonthSelect
        :yearMonthGot="searchingParams.startYear + '-' + searchingParams.startMonth.toString().padStart(2, '0')"
        :minYear="1967"
        :minMonth="1"
        :maxYear="searchingParams.endYear"
        :maxMonth="searchingParams.endMonth"
        @sendbackYearMonth="settingStart" />
      <span class="mx-1">～</span>
      <yearMonthSelect
        :maxYear="getCurrentYear()"
        :maxMonth="getCurrentMonth()"
        :minYear="searchingParams.startYear"
        :minMonth="searchingParams.startMonth"
        @sendbackYearMonth="settingEnd" />
    </div>
    <ui-buttonGroup showSearch :searchDisable="!searchingParams.stockNo" @dataSearch="searchingStockPrice()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, ref } from "vue";
import { fetchStockRangeValue } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IStockPriceRecordList, IResponse } from "@/models/index";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

const emits = defineEmits(["sendbackSearchingData"]);

const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const yearMonthSelect = defineAsyncComponent(() => import("@/components/ui/select/yearMonthSelect.vue"));

const searchingParams = reactive<IStockPriceSearchingParams>({
  stockNo: "",
  startYear: getCurrentYear() - 5,
  startMonth: getCurrentMonth(),
  endYear: getCurrentYear(),
  endMonth: getCurrentMonth(),
});
const stockPriceRecord = ref<IStockPriceRecordList[]>([]);
const stockName = ref<string>("");



async function settingStockNo(selectedData: { value: string; label: string }) {
  searchingParams.stockNo = selectedData.value;
  stockName.value = selectedData.label;
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
  try {
    const res: IResponse = await fetchStockRangeValue(searchingParams);
    // console.log("fetchStockRangeValue:", res.data.data);
    if (res.data.returnCode === 0) {
      stockPriceRecord.value = res.data.data.data;
      showAxiosToast({ message: res.data.message, icon: res.data.data.data.length > 0 ? "success" : "error" });
      const plotlyTitle =
        stockName.value + " " + searchingParams.startYear + "/" + searchingParams.startMonth + " ~ " + searchingParams.endYear + "/" + searchingParams.endMonth + "股價走勢";

      if (stockPriceRecord.value.length > 0) {
        emits("sendbackSearchingData", plotlyTitle, stockPriceRecord.value);
      } else {
        emits("sendbackSearchingData", "", []);
      }

    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
