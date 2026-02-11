<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCuaccountAble'"
      :accountTypeName="'存款帳戶'"
      @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <currencyAccountTradeData @dataReseaching="searchingFinanceRecord" />
      <template v-if="currencyAccountRecord.length > 0">
        <ui-pagination
          :currentPage="currentPage"
          :dataPerpage="itemsPerPage"
          :totalDataQuanity="currencyAccountRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyAccountRecordFiltered.length > 0">
          <div class="rounded-lg overflow-auto">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">帳戶</div>
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
                  <div :class="tailwindStyles.getTdClasses()">{{ record.accountData.accountName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.transactionCategoryData.transactionName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeCategoryData.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.currencyData.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.tradeAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.remainingAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <currencyAccountTradeData
                      :tradeIdGot="record.tradeId"
                      :accountIdGot="record.accountId"
                      :isEditable="record.accountData.enable"
                      @dataReseaching="searchingFinanceRecord" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="currencyAccountRecord.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCurrencyAccountRecordList } from "@/server/currencyAccountRecordApi.ts";
import { IcurrencyAccountRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index.ts";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";

declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "存款帳戶收支",
});

const accountRecordSearching = defineAsyncComponent(() => import("@/components/financeRecord/accountRecordSearching.vue"));
const currencyAccountTradeData = defineAsyncComponent(() => import("@/components/financeRecord/currencyAccountRecord/currencyAccountTradeData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const searchingParams = reactive<IFinanceRecordSearchingParams>({
  accountId: "",
  currencyId: "",
  tradeCategory: "",
  startingDate: getCurrentYear() + "-01-01 00:00:00.001",
  endDate: getCurrentYear() + "-12-31 23:59:59.999",
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
    console.log("fetchCurrencyAccountRecordList:", res.data.data);
    currencyAccountRecord.value = res.data.data;
    await currencyAccountRecordFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function currencyAccountRecordFilterEvent() {
  currencyAccountRecordFiltered.value = currencyAccountRecord.value;
  tableData.value = sliceArray(currencyAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
