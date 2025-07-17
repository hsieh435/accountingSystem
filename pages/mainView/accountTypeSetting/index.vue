<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <tradeCategory />
    </div>

    <div class="mx-5">
      <template v-if="tradeCategoryList.length > 0">
        <ui-pagination
          :totalDataQuanity="tradeCategoryList.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="tradeCategoryListFiltered.length > 0">
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">交易代碼</th>
                  <th :class="tailwindStyles.thClasses">交易名稱</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="account in tableData" :key="account.categoryCode">
                  <td :class="tailwindStyles.thClasses">{{ account.no }}</td>
                  <td :class="tailwindStyles.thClasses">{{ account.categoryCode }}</td>
                  <td :class="tailwindStyles.thClasses">{{ account.categoryName }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <tradeCategory :categoryCodeGot="account.categoryCode" />
                    <ui-buttonGroup showRemove :createText="'刪除交易代碼'" @dataRemove="removeTradeCategory(account.categoryCode)" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="tradeCategoryList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無帳戶資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { ITradeCategory } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "帳戶類型設定",
})



const tradeCategory = defineAsyncComponent(() => import("@/components/parameterSettingComponents/tradeCategory/index.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const tradeCategoryList = ref<ITradeCategory[]>([]);
const tradeCategoryListFiltered = ref<ITradeCategory[]>([]);
const tableData = ref<ITradeCategory[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await tradeCategoryListFilterEvent();
}



async function tradeCategoryListFilterEvent() {
  tradeCategoryListFiltered.value = tradeCategoryList.value;  
  tableData.value = sliceArray(tradeCategoryListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function removeTradeCategory(categoryCode: string) {
  console.log("categoryCode:", categoryCode);
  
}



</script>
<style lang="scss" scoped></style>
