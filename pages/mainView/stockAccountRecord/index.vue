
<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <accountRecordSearching :accountTypeId="'isStaccountAble'" :accountTypeName="'證券帳戶'" />
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
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">交易時間</div>
                <div :class="tailwindStyles.thClasses">買/賣</div>
                <div :class="tailwindStyles.thClasses">股票</div>
                <div :class="tailwindStyles.thClasses">金額</div>
                <div :class="tailwindStyles.thClasses">股數</div>
                <div :class="tailwindStyles.thClasses">手續費</div>
                <div :class="tailwindStyles.thClasses">交易稅</div>
                <div :class="tailwindStyles.thClasses">交易總額</div>
                <div :class="tailwindStyles.thClasses">帳戶餘額</div>
                <div :class="tailwindStyles.thClasses">內容</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="record in tableData" :key="record.tradeId">
                <div :class="tailwindStyles.tdClasses">{{ record.no }}</div>
                <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ record.incomingOutgoing }}</div>
                <div :class="tailwindStyles.tdClasses">{{ record.stockNo }} / {{ record.stockName }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.pricePerShare) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.quantity) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.handlingFee) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.transactionTax) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.totalPrice) }}</div>
                <div :class="tailwindStyles.tdClasses">0</div>
                <div :class="tailwindStyles.tdClasses">{{ record.tradeDescription }}</div>
                <div :class="tailwindStyles.tdLastClasses">
                  <stockAccountTradeData :tradeIdGot="record.tradeId" />
                </div>
              </div>
            </div>
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
  middleware: "auth",
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
