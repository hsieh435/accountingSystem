<template>
  <div class="w-full px-3">
    <div class="flex flex-wrap justify-start items-center">
      <tradeCategoryData @dataReseaching="searchingTradeCategoryList" />
    </div>

    <template v-if="tradeCategoryList.length > 0">
      <ui-pagination
        :currentPage="1"
        :dataPerpage="tradeCategoryList.length"
        :pageArrayGot="[tradeCategoryList.length]"
        :totalDataQuanity="tradeCategoryList.length"
        :showFilter="false" />
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
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { fetchTradeCategoryList } from "@/server/parameterApi";
import { ITradeCategory, IResponse } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg } from "@/composables/swalDialog";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
});



const tradeCategoryData = defineAsyncComponent(() => import("@/components/parameterSettingComponents/tradeCategoryData.vue"));



const tradeCategoryList = ref<ITradeCategory[]>([]);
const tradeCategoryListFiltered = ref<ITradeCategory[]>([]);
const tableData = ref<ITradeCategory[]>([]);



onMounted(async () => {
  await searchingTradeCategoryList();
});



async function searchingTradeCategoryList() {
  try {
    const res: IResponse = await fetchTradeCategoryList();
    // console.log("res:", res);
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
  tableData.value = sliceArray(tradeCategoryListFiltered.value);
}



</script>
<style lang="scss" scoped></style>
