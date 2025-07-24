<template>
  <div class="w-full">
    <!-- <div class="flex justify-start items-center mx-3 my-2">
      <accountTypeData />
    </div> -->

    <div class="mx-5">
      <template v-if="tradeCategoryList.length > 0">
        <ui-pagination
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
                  <!-- <accountTypeData :categoryCodeGot="account.categoryCode" /> -->
                  <ui-buttonGroup showRemove :createText="'刪除交易代碼'" @dataRemove="removeTradeCategory(account.categoryCode)" />
                </div>
              </div>
            </div>
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



const accountTypeData = defineAsyncComponent(() => import("@/components/parameterSettingComponents/accountTypeData.vue"));



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
