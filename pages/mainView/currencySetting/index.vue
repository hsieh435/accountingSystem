<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <currencyData @dataReseaching="searchingCurrencyList" />
    </div>

    <div class="mx-5 my-3">
      <template v-if="currencyList.length > 0">
        <ui-pagination
          :currentPage="currentPage"
          :dataPerpage="itemsPerPage"
          :totalDataQuanity="currencyList.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyListFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">貨幣代碼</div>
                <div :class="tailwindStyles.thClasses">貨幣名稱</div>
                <div :class="tailwindStyles.thClasses">可否刪除</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="currency in tableData" :key="currency.currencyCode">
                <div :class="tailwindStyles.tdClasses">{{ currency.no }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currency.currencyCode }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currency.currencyName }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <font-awesome-icon class="mx-1" :icon="['fas', 'check']" v-if="currency.allowDelete" />
                </div>
                <div :class="tailwindStyles.tdClasses">
                  <currencyData :currencyCodeGot="currency.currencyCode" @dataReseaching="searchingCurrencyList" />
                  <ui-buttonGroup :showRemove="currency.allowDelete" :createText="'刪除貨幣資料'" @dataRemove="removeCurrency(currency.currencyCode)" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="currencyList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無貨幣資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { fetchCurrencyList, fetchDeleteCurrency } from "@/server/currencyApi";
import { ICurrency, IResponse } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
});



const currencyData = defineAsyncComponent(() => import("@/components/parameterSettingComponents/currencyData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const currencyList = ref<ICurrency[]>([]);
const currencyListFiltered = ref<ICurrency[]>([]);
const tableData = ref<ICurrency[]>([]);



onMounted(async () => {
  await searchingCurrencyList();
});



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await currencyListFilterEvent();
}



async function searchingCurrencyList() {
  try {
    const res = await fetchCurrencyList() as IResponse;
    console.log("res:", res);
    if (res.data.returnCode === 0) {
      currencyList.value = res.data.data;
      await currencyListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}



async function currencyListFilterEvent() {
  currencyListFiltered.value = currencyList.value;  
  tableData.value = sliceArray(currencyListFiltered.value, currentPage.value, itemsPerPage.value);
  // console.log("currencyListFiltered:", currencyListFiltered.value);
  // console.log("tableData:", tableData.value);
}



async function removeCurrency(currencyCode: string) {
  // console.log("currencyCode:", currencyCode);
  const confirmResult = await showConfirmDialog({
    message: "確定刪除該貨幣資料嗎？",
    confirmButtonMsg: "刪除",
    executionApi: fetchDeleteCurrency,
    apiParams: currencyCode,
  });

  if (confirmResult) {
    await searchingCurrencyList();
  }
}



</script>
<style lang="scss" scoped></style>
