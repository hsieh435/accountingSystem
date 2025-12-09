<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isStoredvaluecardAble'"
      :accountTypeName="'儲值票卡'"
      @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <storedValueCardTradeData @dataReseaching="searchingFinanceRecord" />
      <template v-if="storedValueCardRecordList.length > 0">
        <ui-pagination
          :totalDataQuanity="storedValueCardRecordListFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="storedValueCardRecordListFiltered.length > 0">
          <div class="rounded-lg overflow-hidden p-0">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">票卡名稱</div>
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
                  <div :class="tailwindStyles.getTdClasses()">{{ record.storedValueCardName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.transactionName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.tradeAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.remainingAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <storedValueCardTradeData
                      :tradeIdGot="record.tradeId"
                      :storedValueCardIdGot="record.storedValueCardId"
                      @dataReseaching="searchingFinanceRecord" />
                    <!-- <ui-buttonGroup showRemove :removeText="'刪除儲值票卡收支'" v-if="record.enable" /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="storedValueCardRecordList.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchStoredValueCardRecordList } from "@/server/storedValueCardRecordApi.ts";
import { IStoredValueCardRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index.ts";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";

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
    storedValueCardRecordList.value = res.data.data;
    await storedValueCardRecordListFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function storedValueCardRecordListFilterEvent() {
  storedValueCardRecordListFiltered.value = storedValueCardRecordList.value;
  tableData.value = sliceArray(storedValueCardRecordListFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
