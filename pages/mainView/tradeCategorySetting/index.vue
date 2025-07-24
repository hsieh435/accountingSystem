<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <tradeCategoryData @dataReseaching="searchingTradeCategoryList" />
    </div>

    <div class="mx-5 my-3">
      <template v-if="tradeCategoryList.length > 0">
        <ui-pagination
          :currentPage="currentPage"
          :dataPerpage="itemsPerPage"
          :totalDataQuanity="tradeCategoryList.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="tradeCategoryListFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">交易代碼</div>
                <div :class="tailwindStyles.thClasses">交易名稱</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="account in tableData" :key="account.categoryCode">
                <div :class="tailwindStyles.tdClasses">{{ account.no }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.categoryCode }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.categoryName }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <tradeCategoryData :categoryCodeGot="account.categoryCode" @dataReseaching="searchingTradeCategoryList" />
                  <ui-buttonGroup showRemove :createText="'刪除交易代碼'" @dataRemove="removeTradeCategory(account.categoryCode)" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="tradeCategoryList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無交易代碼資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { fetchTradeCategoryList, fetchDeleteTradeCategory } from "@/server/tradeCategoryApi";
import { ITradeCategory, IResponse } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
});



const tradeCategoryData = defineAsyncComponent(() => import("@/components/parameterSettingComponents/tradeCategoryData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const tradeCategoryList = ref<ITradeCategory[]>([]);
const tradeCategoryListFiltered = ref<ITradeCategory[]>([]);
const tableData = ref<ITradeCategory[]>([]);



onMounted(async () => {
  await searchingTradeCategoryList();
});



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await tradeCategoryListFilterEvent();
}



async function searchingTradeCategoryList() {
  try {
    const res = await fetchTradeCategoryList() as IResponse;
    console.log("res:", res);
    if (res.data.returnCode === 0) {
      tradeCategoryList.value = res.data.data;
      await tradeCategoryListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}



async function tradeCategoryListFilterEvent() {
  tradeCategoryListFiltered.value = tradeCategoryList.value;  
  tableData.value = sliceArray(tradeCategoryListFiltered.value, currentPage.value, itemsPerPage.value);
  // console.log("tradeCategoryListFiltered:", tradeCategoryListFiltered.value);
  // console.log("tableData:", tableData.value);
}



async function removeTradeCategory(categoryCode: string) {
  console.log("categoryCode:", categoryCode);
  
  const confirmResult = await showConfirmDialog({
    message: "確定刪除該交易類別嗎？",
    confirmButtonMsg: "刪除",
    executionApi: fetchDeleteTradeCategory,
    apiParams: categoryCode,
  });

  if (confirmResult) {
    await searchingTradeCategoryList();
  }


}



</script>
<style lang="scss" scoped></style>
