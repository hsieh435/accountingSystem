<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCashflowAble'"
      :accountTypeName="'現金流'"
      @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1"></div>
    <cashFlowTradeData @dataReseaching="searchingfinancerecord" />
  </div>
  <div class="px-3">
    <template v-if="cashFlowRecord.length > 0">
      <ui-pagination
        :totalDataQuanity="cashFlowRecordFiltered.length"
        :showFilter="false"
        @tableSliceChange="settingTableSlice" />
      <template v-if="cashFlowRecordFiltered.length > 0">
        <div :class="tailwindStyles.tableClasses">
          <div :class="tailwindStyles.theadClasses">
            <div :class="tailwindStyles.theadtrClasses">
              <div :class="tailwindStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.thClasses">交易時間</div>
              <div :class="tailwindStyles.thClasses">收支</div>
              <div :class="tailwindStyles.thClasses">項目</div>
              <div :class="tailwindStyles.thClasses">金額</div>
              <div :class="tailwindStyles.thClasses">餘額</div>
              <div :class="tailwindStyles.thClasses">內容</div>
              <div :class="tailwindStyles.thClasses">操作</div>
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
                  <cashFlowTradeData :cashflowIdGot="record.cashflowId" :tradeIdGot="record.tradeId" @dataReseaching="searchingfinancerecord" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="cashFlowRecord.length === 0">
      <span :class="tailwindStyles.noDataClasses">無交易資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCashFlowRecordList } from "@/server/cashFlowRecordApi";
import { ICashFlowRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

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
  searchingfinancerecord();
});



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await cashFlowRecordFilterEvent();
}

async function settingSearchingParams(params: IFinanceRecordSearchingParams) {
  // searchingParams.accountId = params.accountId;
  // searchingParams.currencyId = params.currencyId;
  // searchingParams.tradeCategory = params.tradeCategory;
  // searchingParams.startingDate = params.startingDate;
  // searchingParams.endDate = params.endDate;
  Object.assign(searchingParams, params);
  console.log("searchingParams:", searchingParams);
  await searchingfinancerecord();
}

async function searchingfinancerecord() {

  try {
    const res: IResponse = await fetchCashFlowRecordList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      cashFlowRecord.value = res.data.data;
      await cashFlowRecordFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function cashFlowRecordFilterEvent() {
  cashFlowRecordFiltered.value = cashFlowRecord.value;
  tableData.value = sliceArray(cashFlowRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
