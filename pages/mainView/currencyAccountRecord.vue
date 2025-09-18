<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCuaccountAble'"
      :accountTypeName="'存款帳戶'"
      @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1"></div>
    <currencyAccountTradeData @dataReseaching="searchingFinanceRecord" />
  </div>
  <div class="px-5">
    <template v-if="currencyAccountRecord.length > 0">
      <ui-pagination
        :totalDataQuanity="currencyAccountRecordFiltered.length"
        :showFilter="false"
        @tableSliceChange="settingTableSlice" />
      <template v-if="currencyAccountRecordFiltered.length > 0">
        <div :class="tailwindStyles.tailwindTableStyles.tableClasses">
          <div :class="tailwindStyles.tailwindTableStyles.theadClasses">
            <div :class="tailwindStyles.tailwindTableStyles.theadtrClasses">
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">帳戶</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">交易時間</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">收支</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">項目</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">貨幣</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">金額</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">餘額</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">內容</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">操作</div>
            </div>
          </div>
          <div :class="tailwindStyles.tailwindTableStyles.tbodyClasses">
            <div :class="tailwindStyles.tailwindTableStyles.tbodytrClasses" v-for="record in tableData" :key="record.tradeId">
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.no }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.accountName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.transactionName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.tradeName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.currencyName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(record.tradeAmount) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">0</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.tradeDescription }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                <currencyAccountTradeData :tradeIdGot="record.tradeId" :accountIdGot="record.accountId" @dataReseaching="searchingFinanceRecord" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="currencyAccountRecord.length === 0">
      <span :class="tailwindStyles.tailwindTableStyles.noDataClasses">無交易資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCurrencyAccountRecordList } from "@/server/currencyAccountRecordApi";
import { IcurrencyAccountRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "存款帳戶收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/accountRecordSearching.vue"),
);
const currencyAccountTradeData = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/currencyAccountRecord/currencyAccountTradeData.vue"),
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
const currencyAccountRecord = ref<IcurrencyAccountRecordList[]>([]);
const currencyAccountRecordFiltered = ref<IcurrencyAccountRecordList[]>([]);
const tableData = ref<IcurrencyAccountRecordList[]>([]);

onMounted(() => {
  searchingFinanceRecord();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await currencyAccountRecordFilterEvent();
}

async function settingSearchingParams(params: IFinanceRecordSearchingParams) {
  searchingParams.accountId = params.accountId;
  searchingParams.currencyId = params.currencyId;
  searchingParams.tradeCategory = params.tradeCategory;
  searchingParams.startingDate = params.startingDate;
  searchingParams.endDate = params.endDate;
  await searchingFinanceRecord();
}

async function searchingFinanceRecord() {

  try {
    const res: IResponse = await fetchCurrencyAccountRecordList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      currencyAccountRecord.value = res.data.data;
      await currencyAccountRecordFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function currencyAccountRecordFilterEvent() {
  currencyAccountRecordFiltered.value = currencyAccountRecord.value;
  tableData.value = sliceArray(currencyAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
