<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <accountRecordSearching :accountTypeId="'isCashflowAble'" :accountTypeName="'持有現金'" /> 
    </div>

    <div class="flex justify-start items-center mx-3 my-2">
      <cashFlowTradeData />
    </div>
    <div class="mx-5">
      <template v-if="cashFlowRecord.length > 0">
        <ui-pagination 
          :totalDataQuanity="cashFlowRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="cashFlowRecordFiltered.length > 0">
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr>
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">交易時間</th>
                  <th :class="tailwindStyles.thClasses">收支</th>
                  <th :class="tailwindStyles.thClasses">項目</th>
                  <th :class="tailwindStyles.thClasses">金額</th>
                  <th :class="tailwindStyles.thClasses">餘額</th>
                  <th :class="tailwindStyles.thClasses">內容</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="record in tableData" :key="record.tradeId">
                  <td :class="tailwindStyles.tdClasses">{{ record.no }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ record.incomingOutgoing }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ record.tradeCategory }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currencyFormat(record.tradeAmount) }}</td>
                  <td :class="tailwindStyles.tdClasses">0</td>
                  <td :class="tailwindStyles.tdClasses">{{ record.tradeDescription }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <cashFlowTradeData :tradeIdGot="record.tradeId" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="cashFlowRecord.length === 0">
        <span :class="tailwindStyles.noDataClasses">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { ICashFlowRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "現金收支",
});



const accountRecordSearching = defineAsyncComponent(() => import("@/components/financeRecordComponents/accountRecordSearching.vue"));
const cashFlowTradeData = defineAsyncComponent(() => import("@/components/financeRecordComponents/cashFlowRecord/cashFlowTradeData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const cashFlowRecord = ref<ICashFlowRecordList[]>([]);
const cashFlowRecordFiltered = ref<ICashFlowRecordList[]>([]);
const tableData = ref<ICashFlowRecordList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await cashFlowRecordFilterEvent();
}



async function cashFlowRecordFilterEvent() {
  cashFlowRecordFiltered.value = cashFlowRecord.value;  
  tableData.value = sliceArray(cashFlowRecordFiltered.value, currentPage.value, itemsPerPage.value);
}


</script>
<style lang="scss" scoped></style>
