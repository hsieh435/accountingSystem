<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <accountRecordSearching :accountTypeId="'isCreditcardAble'" :accountTypeName="'信用卡'" />
    </div>

    <div class="flex justify-start items-center mx-3 my-2">
      <creditCardTradeData :creditCardIdGot="'123456'" />
    </div>
    <div class="mx-5">
      <template v-if="creditCardRecord.length > 0">
        <ui-pagination 
          :totalDataQuanity="creditCardRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="creditCardRecordFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">交易時間</div>
                <div :class="tailwindStyles.thClasses">項目</div>
                <div :class="tailwindStyles.thClasses">金額</div>
                <div :class="tailwindStyles.thClasses">剩餘額度</div>
                <div :class="tailwindStyles.thClasses">內容</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
              <div :class="tailwindStyles.tbodyClasses">
                <div :class="tailwindStyles.tbodytrClasses" v-for="record in tableData" :key="record.tradeId">
                  <div :class="tailwindStyles.tdClasses">{{ record.no }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ record.tradeCategory }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ currencyFormat(record.tradeAmount) }}</div>
                  <div :class="tailwindStyles.tdClasses">0</div>
                  <div :class="tailwindStyles.tdClasses">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.tdClasses">
                    <creditCardTradeData :tradeIdGot="record.tradeId" :creditCardIdGot="record.creditCardId"  />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="creditCardRecord.length === 0">
        <span :class="tailwindStyles.noDataClasses">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { ICreditCardRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "信用卡收支",
});



const accountRecordSearching = defineAsyncComponent(() => import("@/components/financeRecordComponents/accountRecordSearching.vue"));
const creditCardTradeData = defineAsyncComponent(() => import("@/components/financeRecordComponents/creditCardRecord/creditCardTradeData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const creditCardRecord = ref<ICreditCardRecordList[]>([]);
const creditCardRecordFiltered = ref<ICreditCardRecordList[]>([]);
const tableData = ref<ICreditCardRecordList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await cashCardRecordFilterEvent();
}



async function cashCardRecordFilterEvent() {
  creditCardRecordFiltered.value = creditCardRecord.value;  
  tableData.value = sliceArray(creditCardRecordFiltered.value, currentPage.value, itemsPerPage.value);
}



</script>
<style lang="scss" scoped></style>
