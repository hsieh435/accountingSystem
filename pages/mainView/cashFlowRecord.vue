<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCashflowAble'"
      :accountTypeName="'現金流'"
      @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1"></div>
    <cashFlowTradeData @dataReseaching="searchingFinanceRecord" />
  </div>
  <div class="px-3">
    <template v-if="cashFlowRecord.length > 0">
      <ui-pagination
        :totalDataQuanity="cashFlowRecordFiltered.length"
        :showFilter="false"
        @tableSliceChange="settingTableSlice" />
      <template v-if="cashFlowRecordFiltered.length > 0">
        <div class="rounded-lg overflow-hidden p-0">
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
                <div :class="tailwindStyles.getTdClasses()">0</div>
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
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCashFlowRecordList } from "@/server/cashFlowRecordApi";
import { ICashFlowRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { errorMessageDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "現金收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/accountRecordSearching.vue"),
);
const cashFlowTradeData = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/cashFlowRecord/cashFlowTradeData.vue"),
);

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const searchingParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01",
  endDate: getCurrentYear() + "-12-31",
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
  console.log("searchingParams:", searchingParams);
  await searchingFinanceRecord();
}

async function searchingFinanceRecord() {
  try {
    const res: IResponse = await fetchCashFlowRecordList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      cashFlowRecord.value = res.data.data;
      await cashFlowRecordFilterEvent();
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function cashFlowRecordFilterEvent() {
  cashFlowRecordFiltered.value = cashFlowRecord.value;
  tableData.value = sliceArray(cashFlowRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
