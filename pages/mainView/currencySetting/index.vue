<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <currencySetting @dataReseaching="searchingCurrencySettingList" />
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
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">貨幣代碼</th>
                  <th :class="tailwindStyles.thClasses">貨幣名稱</th>
                  <!-- <th :class="tailwindStyles.thClasses">匯率</th> -->
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody :class="tailwindStyles.tbodyClasses">
                <tr :class="tailwindStyles.trClasses" v-for="currency in tableData" :key="currency.currencyCode">
                  <td :class="tailwindStyles.tdClasses">{{ currency.no }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currency.currencyCode }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currency.currencyName }}</td>
                  <!-- <td :class="tailwindStyles.tdClasses">{{ 0 }}</td> -->
                  <td :class="tailwindStyles.tdLastClasses">
                    <currencySetting :currencyCodeGot="currency.currencyCode" @dataReseaching="searchingCurrencySettingList" />
                    <ui-buttonGroup showRemove :createText="'刪除貨幣資料'" @dataRemove="removeCurrency(currency.currencyCode)" />
                  </td>
                </tr>
              </tbody>
            </table>
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



const currencySetting = defineAsyncComponent(() => import("@/components/parameterSettingComponents/currencySetting/index.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const currencyList = ref<ICurrency[]>([]);
const currencyListFiltered = ref<ICurrency[]>([]);
const tableData = ref<ICurrency[]>([]);



onMounted(async () => {
  await searchingCurrencySettingList();
});



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await currencyListFilterEvent();
}



async function searchingCurrencySettingList() {
  try {
    const res = await fetchCurrencyList() as IResponse;
    // console.log("res:", res);
    if (res.data.returnCode === 0) {
      currencyList.value = res.data;
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
  console.log("currencyCode:", currencyCode);

  const confirmResult = await showConfirmDialog({
    message: "確定刪除該貨幣資料嗎？",
    confirmButtonMsg: "刪除",
    executionApi: fetchDeleteCurrency,
    apiParams: currencyCode,
  });

  if (confirmResult) {
    await searchingCurrencySettingList();
  }
}



</script>
<style lang="scss" scoped></style>
