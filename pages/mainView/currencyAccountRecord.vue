<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <accountRecordSearching :accountTypeId="'isCuaccountAble'" :accountTypeName="'存款帳戶'" />
    </div>

    <div class="flex justify-start items-center mx-3 my-2">
      <currencyAccountTradeData :bankIdGot="''" />
    </div>
    <div class="mx-5">
      <template v-if="currencyAccountRecord.length > 0">
        <ui-pagination
          :totalDataQuanity="currencyAccountRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyAccountRecordFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">交易時間</div>
                <div :class="tailwindStyles.thClasses">收支</div>
                <div :class="tailwindStyles.thClasses">項目</div>
                <div :class="tailwindStyles.thClasses">金額</div>
                <div :class="tailwindStyles.thClasses">剩餘額度</div>
                <div :class="tailwindStyles.thClasses">內容</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="record in tableData" :key="record.tradeId">
                <div :class="tailwindStyles.tdClasses">{{ record.no }}</div>
                <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ record.transactionType }}</div>
                <div :class="tailwindStyles.tdClasses">{{ record.tradeCategory }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.tradeAmount) }}</div>
                <div :class="tailwindStyles.tdClasses">0</div>
                <div :class="tailwindStyles.tdClasses">{{ record.tradeDescription }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <currencyAccountTradeData :tradeIdGot="record.tradeId" :bankIdGot="record.accountId" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="currencyAccountRecord.length === 0">
        <span :class="tailwindStyles.noDataClasses">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { IcurrencyAccountRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "存款帳戶收支",
})



const accountRecordSearching = defineAsyncComponent(() => import("@/components/financeRecordComponents/accountRecordSearching.vue"));
const currencyAccountTradeData = defineAsyncComponent(() => import("@/components/financeRecordComponents/currencyAccountRecord/currencyAccountTradeData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const currencyAccountRecord = ref<IcurrencyAccountRecordList[]>([]);
const currencyAccountRecordFiltered = ref<IcurrencyAccountRecordList[]>([]);
const tableData = ref<IcurrencyAccountRecordList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await currencyAccountRecordFilterEvent();
}



async function currencyAccountRecordFilterEvent() {
  currencyAccountRecordFiltered.value = currencyAccountRecord.value;
  tableData.value = sliceArray(currencyAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}



</script>
<style lang="scss" scoped></style>
