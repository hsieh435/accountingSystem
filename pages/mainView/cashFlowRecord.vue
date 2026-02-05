<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCashflowAble'"
      :accountTypeName="'現金流'"
      @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <cashFlowTradeData @dataReseaching="searchingFinanceRecord" />
      <template v-if="cashFlowRecord.length > 0">
        <ui-pagination
          :totalDataQuanity="cashFlowRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="cashFlowRecordFiltered.length > 0">
          <div class="rounded-lg overflow-auto">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">現金流</div>
                  <div :class="tailwindStyles.getThClasses()">交易時間</div>
                  <div :class="tailwindStyles.getThClasses()">收支</div>
                  <div :class="tailwindStyles.getThClasses()">項目</div>
                  <div :class="tailwindStyles.getThClasses()">貨幣</div>
                  <div :class="tailwindStyles.getThClasses()">金額</div>
                  <div :class="tailwindStyles.getThClasses()">餘額</div>
                  <div :class="tailwindStyles.getThClasses()">內容</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div :class="tailwindStyles.getTbodytrClasses()" v-for="record in tableData" :key="record.tradeId">
                  <div :class="tailwindStyles.getTdClasses()">{{ record.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.cashflowName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.transactionName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.tradeAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.remainingAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <cashFlowTradeData
                      :cashflowIdGot="record.cashflowId"
                      :tradeIdGot="record.tradeId"
                      @dataReseaching="searchingFinanceRecord" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="cashFlowRecord.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCashFlowRecordList } from "@/server/cashFlowRecordApi.ts";
import { ICashFlowRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index.ts";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";

declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "現金收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecord/accountRecordSearching.vue"),
);
const cashFlowTradeData = defineAsyncComponent(
  () => import("@/components/financeRecord/cashFlowRecord/cashFlowTradeData.vue"),
);

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const searchingParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01 00:00:00.001",
  endDate: getCurrentYear() + "-12-31 23:59:59.999",
});
const cashFlowRecord = ref<ICashFlowRecordList[]>([]);
const cashFlowRecordFiltered = ref<ICashFlowRecordList[]>([]);
const tableData = ref<ICashFlowRecordList[]>([]);

onMounted(() => {
  searchingFinanceRecord();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await cashFlowRecordFilterEvent();
}

async function settingSearchingParams(params: IFinanceRecordSearchingParams) {
  Object.assign(searchingParams, params);
  await searchingFinanceRecord();
}

async function searchingFinanceRecord() {
  // console.log("searchingParams:", searchingParams);
  try {
    const res: IResponse = await fetchCashFlowRecordList(searchingParams);
    console.log("res:", res.data.data);
    cashFlowRecord.value = res.data.data;
    await cashFlowRecordFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function cashFlowRecordFilterEvent() {
  cashFlowRecordFiltered.value = cashFlowRecord.value;
  tableData.value = sliceArray(cashFlowRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
