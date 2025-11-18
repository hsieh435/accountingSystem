<template>
  <div class="flex-col justify-start items-center">
    <div class="py-1 px-3">
      <currencyData @dataReseaching="searchingCurrencyList" />
      <template v-if="currencyList.length > 0">
        <ui-pagination
          :currentPage="currentPage"
          :dataPerpage="itemsPerPage"
          :totalDataQuanity="currencyList.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyListFiltered.length > 0">
          <div class="rounded-lg overflow-hidden p-0">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">貨幣代碼</div>
                  <div :class="tailwindStyles.getThClasses()">貨幣名稱</div>
                  <div :class="tailwindStyles.getThClasses()">貨幣符號</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div
                  :class="tailwindStyles.getTbodytrClasses()"
                  v-for="currency in tableData"
                  :key="currency.currencyCode">
                  <div :class="tailwindStyles.getTdClasses()">{{ currency.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currency.currencyCode }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currency.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currency.currencySymbol }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <currencyData :currencyCodeGot="currency.currencyCode" @dataReseaching="searchingCurrencyList" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="currencyList.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無貨幣資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { fetchCurrencyList } from "@/server/parameterApi";
import { ICurrencyList, IResponse } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
});

const currencyData = defineAsyncComponent(() => import("@/components/parameterSettingComponents/currencyData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const currencyList = ref<ICurrencyList[]>([]);
const currencyListFiltered = ref<ICurrencyList[]>([]);
const tableData = ref<ICurrencyList[]>([]);

onMounted(async () => {
  await searchingCurrencyList();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await currencyListFilterEvent();
}

async function searchingCurrencyList() {
  try {
    const res: IResponse = await fetchCurrencyList();
    console.log("fetchCurrencyList:", res.data.data);
    currencyList.value = res.data.data;
    await currencyListFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function currencyListFilterEvent() {
  currencyListFiltered.value = currencyList.value;
  tableData.value = sliceArray(currencyListFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
