<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isStoredvaluecardAble'"
      :accountTypeName="'儲值票卡'"
      @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1"></div>
    <storedValueCardTradeData @dataReseaching="searchingFinanceRecord" />
  </div>
  <div class="px-3">
    <template v-if="storedValueCardRecordList.length > 0">
      <ui-pagination
        :totalDataQuanity="storedValueCardRecordListFiltered.length"
        :showFilter="false"
        @tableSliceChange="settingTableSlice" />
      <template v-if="storedValueCardRecordListFiltered.length > 0">
        <div :class="tailwindStyles.tailwindTableStyles.tableClasses">
          <div :class="tailwindStyles.tailwindTableStyles.theadClasses">
            <div :class="tailwindStyles.tailwindTableStyles.theadtrClasses">
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">票卡名稱</div>
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
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.storedValueCardName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.transactionName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.tradeName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.currencyName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(record.tradeAmount) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">0</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ record.tradeDescription }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                <storedValueCardTradeData
                  :tradeIdGot="record.tradeId"
                  :storedValueCardIdGot="record.storedValueCardId"
                  @dataReseaching="searchingFinanceRecord" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="storedValueCardRecordList.length === 0">
      <span :class="tailwindStyles.tailwindTableStyles.noDataClasses">無交易資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchStoredValueCardRecordList } from "@/server/storedValueCardRecordApi";
import { IStoredValueCardRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "儲值票卡收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/accountRecordSearching.vue"),
);
const storedValueCardTradeData = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/storedValueCardRecord/storedValueCardTradeData.vue"),
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
const storedValueCardRecordList = ref<IStoredValueCardRecordList[]>([]);
const storedValueCardRecordListFiltered = ref<IStoredValueCardRecordList[]>([]);
const tableData = ref<IStoredValueCardRecordList[]>([]);

onMounted(() => {
  searchingFinanceRecord();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await storedValueCardRecordListFilterEvent();
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
    const res: IResponse = await fetchStoredValueCardRecordList(searchingParams);
    console.log("fetchStoredValueCardRecordList:", res.data.data);
    if (res.data.returnCode === 0) {
      storedValueCardRecordList.value = res.data.data;
      await storedValueCardRecordListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function storedValueCardRecordListFilterEvent() {
  storedValueCardRecordListFiltered.value = storedValueCardRecordList.value;
  tableData.value = sliceArray(storedValueCardRecordListFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
