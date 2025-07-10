<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <accountRecordSearching :accountTypeId="'currencyAccount'" :accountTypeName="'存款帳戶'" />
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
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">交易時間</th>
                  <th :class="tailwindStyles.thClasses">收支</th>
                  <th :class="tailwindStyles.thClasses">項目</th>
                  <th :class="tailwindStyles.thClasses">金額</th>
                  <th :class="tailwindStyles.thClasses">剩餘額度</th>
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
                    <currencyAccountTradeData :tradeIdGot="record.tradeId" :bankIdGot="record.accountId" />
                  </td>
                </tr>
              </tbody>
            </table>
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
  functionTitle: "財務收支",
  subTitle: "存款帳戶收支",
})



const accountRecordSearching = defineAsyncComponent(() => import("@/components/financeRecordComponents/accountRecordSearching.vue"));
const currencyAccountTradeData = defineAsyncComponent(() => import("@/components/financeRecordComponents/currencyAccountRecord/currencyAccountTradeData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const currencyAccountRecord = ref<IcurrencyAccountRecordList[]>([]);
const currencyAccountRecordFiltered = ref<IcurrencyAccountRecordList[]>([]);
const tableData = ref<IcurrencyAccountRecordList[]>([]);



async function settingTableSlice(currentPageSendback: number, itemsPerPageSendback: number, keyWord: string) {
  currentPage.value = currentPageSendback;
  itemsPerPage.value = itemsPerPageSendback;
  searchWord.value = keyWord.trim();
  await currencyAccountRecordFilterEvent();
}



async function currencyAccountRecordFilterEvent() {
  currencyAccountRecordFiltered.value = currencyAccountRecord.value;  
  tableData.value = sliceArray(currencyAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}


</script>
<style lang="scss" scoped></style>
