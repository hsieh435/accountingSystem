
<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <accountRecordSearching :accountTypeId="'stockAccount'" :accountTypeName="'證券帳戶'" />
    </div>

    <div class="flex justify-start items-center mx-3 my-2">
      <stockAccountTradeData />
    </div>
    <div class="mx-5">
      <template v-if="stockAccountRecord.length > 0">
        <ui-pagination 
          :totalDataQuanity="stockAccountRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="stockAccountRecordFiltered.length > 0">
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">交易時間</th>
                  <th :class="tailwindStyles.thClasses">買/賣</th>
                  <th :class="tailwindStyles.thClasses">股票</th>
                  <th :class="tailwindStyles.thClasses">金額</th>
                  <th :class="tailwindStyles.thClasses">股數</th>
                  <th :class="tailwindStyles.thClasses">手續費</th>
                  <th :class="tailwindStyles.thClasses">交易稅</th>
                  <th :class="tailwindStyles.thClasses">交易總額</th>
                  <th :class="tailwindStyles.thClasses">帳戶餘額</th>
                  <th :class="tailwindStyles.thClasses">內容</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="record in tableData" :key="record.tradeId">
                  <td :class="tailwindStyles.tdClasses">{{ record.no }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ record.incomingOutgoing }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ record.stockNo }} / {{ record.stockName }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currencyFormat(record.pricePerShare) }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currencyFormat(record.quantity) }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currencyFormat(record.handlingFee) }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currencyFormat(record.transactionTax) }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ currencyFormat(record.totalPrice) }}</td>
                  <td :class="tailwindStyles.tdClasses">0</td>
                  <td :class="tailwindStyles.tdClasses">{{ record.tradeDescription }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <stockAccountTradeData :tradeIdGot="record.tradeId" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="stockAccountRecord.length === 0">
        <span :class="tailwindStyles.noDataClasses">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { IStockAccountRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "證券帳戶收支",
});



const accountRecordSearching = defineAsyncComponent(() => import("@/components/financeRecordComponents/accountRecordSearching.vue"));
const stockAccountTradeData = defineAsyncComponent(() => import("@/components/financeRecordComponents/stockAccountRecord/stockAccountTradeData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const stockAccountRecord = ref<IStockAccountRecordList[]>([]);
const stockAccountRecordFiltered = ref<IStockAccountRecordList[]>([]);
const tableData = ref<IStockAccountRecordList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await stockAccountRecordFilterEvent();
}



async function stockAccountRecordFilterEvent() {
  stockAccountRecordFiltered.value = stockAccountRecord.value;  
  tableData.value = sliceArray(stockAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}



</script>
<style lang="scss" scoped></style>
