<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isStaccountAble'"
      :accountTypeName="'證券帳戶'"
      @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <stockAccountTradeData @dataReseaching="searchingFinanceRecord" />
      <template v-if="stockAccountRecord.length > 0">
        <ui-pagination
          :totalDataQuanity="stockAccountRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="stockAccountRecordFiltered.length > 0">
          <div class="rounded-lg overflow-hidden p-0">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">交易時間</div>
                  <div :class="tailwindStyles.getThClasses()">收支</div>
                  <div :class="tailwindStyles.getThClasses()">項目</div>
                  <div :class="tailwindStyles.getThClasses()">股票</div>
                  <div :class="tailwindStyles.getThClasses()">金額</div>
                  <div :class="tailwindStyles.getThClasses()">股數</div>
                  <div :class="tailwindStyles.getThClasses()">手續費</div>
                  <div :class="tailwindStyles.getThClasses()">交易稅</div>
                  <div :class="tailwindStyles.getThClasses()">交易總額</div>
                  <div :class="tailwindStyles.getThClasses()">帳戶餘額</div>
                  <div :class="tailwindStyles.getThClasses()">內容</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div :class="tailwindStyles.getTbodytrClasses()" v-for="record in tableData" :key="record.tradeId">
                  <div :class="tailwindStyles.getTdClasses()">{{ record.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.transactionName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.stockNo + " " + record.stockName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.pricePerShare) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.quantity) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.handlingFee) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.transactionTax) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.tradeTotalPrice) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.remainingAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <stockAccountTradeData
                      :tradeIdGot="record.tradeId"
                      :accountIdGot="record.accountId"
                      @dataReseaching="searchingFinanceRecord" />
                    <!-- <ui-buttonGroup showRemove :removeText="'刪除證券帳戶收支'" v-if="record.enable" /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="stockAccountRecord.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchStockAccountRecordList } from "@/server/stockAccountRecordApi.ts";
import { IStockAccountRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index.ts";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";
import { messageToast } from "@/composables/swalDialog.ts";

declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "證券帳戶收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/accountRecordSearching.vue"),
);
const stockAccountTradeData = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/stockAccountRecord/stockAccountTradeData.vue"),
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
const stockAccountRecord = ref<IStockAccountRecordList[]>([]);
const stockAccountRecordFiltered = ref<IStockAccountRecordList[]>([]);
const tableData = ref<IStockAccountRecordList[]>([]);

onMounted(() => {
  searchingFinanceRecord();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await stockAccountRecordFilterEvent();
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
    const res: IResponse = await fetchStockAccountRecordList(searchingParams);
    console.log("res:", res.data.data);
    stockAccountRecord.value = res.data.data;
    await stockAccountRecordFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function stockAccountRecordFilterEvent() {
  stockAccountRecordFiltered.value = stockAccountRecord.value;
  tableData.value = sliceArray(stockAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
