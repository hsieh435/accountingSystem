<template>
  <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
    <div class="flex items-center me-3 my-1">
      <span>股票：</span><stockListSelect @sendbackStockNo="settingStockNo" />
    </div>
    <div class="flex items-center me-3 my-1">
      <span>查詢區間：</span>
      <dateSelect
        :dateSelect="searchingParams.startDate"
        :minDate="'1967-01-01'"
        :maxDate="dateMove(searchingParams.endDate, -1)"
        @sendbackDate="settingStart" />
      <span class="mx-1">～</span>
      <dateSelect
        :dateSelect="searchingParams.endDate"
        :minDate="dateMove(searchingParams.startDate, 1)"
        :maxDate="getCurrentYMD()"
        @sendbackDate="settingEnd" />
    </div>
    <ui-buttonGroup showSearch :searchDisable="!searchingParams.stockNo || searchingParams.startDate === searchingParams.endDate" @dataSearch="searchingStockPrice()" />
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, reactive, ref } from "vue";
import { fetchStockRangeValue } from "@/server/outerWebApi";
import { IStockPriceSearchingParams, IStockPriceRecordList, IResponse } from "@/models/index";
import { getCurrentYMD, getCurrentYear, getCurrentMonth, getCurrentDate, dateMove } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

const emits = defineEmits(["sendbackSearchingData"]);

const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));

const searchingParams = reactive<IStockPriceSearchingParams>({
  stockNo: "",
  startDate: `${getCurrentYear()}-${getCurrentMonth() - 1}-${getCurrentDate()}`,
  endDate: getCurrentYMD(),
});
const stockPriceRecord = ref<IStockPriceRecordList[]>([]);
const stockName = ref<string>("");

async function settingStockNo(selectedData: { value: string; label: string }) {
  searchingParams.stockNo = selectedData.value;
  stockName.value = selectedData.label;
}

async function settingStart(date: string) {
  searchingParams.startDate = date;
}

async function settingEnd(date: string) {
  searchingParams.endDate = date;
}

async function searchingStockPrice() {
  // console.log("searchingParams:", searchingParams);

  try {
    const res: IResponse = await fetchStockRangeValue(searchingParams);
    // console.log("fetchStockRangeValue:", res.data.data);
    if (res.data.returnCode === 0) {
      stockPriceRecord.value = res.data.data.data;
      const plotlyTitle =
        stockName.value + " " + searchingParams.startDate.replace(/-/g, "/") + " ~ " + searchingParams.endDate.replace(/-/g, "/") + "股價走勢";

      if (stockPriceRecord.value.length > 0) {
        showAxiosToast({ message: res.data.message, icon: "success" });
        emits("sendbackSearchingData", plotlyTitle, stockPriceRecord.value);
      } else {
        showAxiosToast({ message: "查無資料", icon: "warning" });
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
