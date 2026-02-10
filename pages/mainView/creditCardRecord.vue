<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCreditcardAble'"
      :accountTypeName="'信用卡'"
      @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1 px-3">
      <creditCardTradeData @dataReseaching="searchingFinanceRecord" />
      <template v-if="creditCardRecord.length > 0">
        <ui-pagination
          :currentPage="currentPage"
          :dataPerpage="itemsPerPage"
          :totalDataQuanity="creditCardRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="creditCardRecordFiltered.length > 0">
          <div class="rounded-lg overflow-auto">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">信用卡</div>
                  <div :class="tailwindStyles.getThClasses()">交易時間</div>
                  <div :class="tailwindStyles.getThClasses()">項目</div>
                  <div :class="tailwindStyles.getThClasses()">貨幣</div>
                  <div :class="tailwindStyles.getThClasses()">金額</div>
                  <div :class="tailwindStyles.getThClasses()">剩餘額度</div>
                  <div :class="tailwindStyles.getThClasses()">內容</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div :class="tailwindStyles.getTbodytrClasses()" v-for="record in tableData" :key="record.tradeId">
                  <div :class="tailwindStyles.getTdClasses()">{{ record.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.creditcardName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.tradeAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.remainingAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <creditCardTradeData
                      :tradeIdGot="record.tradeId"
                      :creditCardIdGot="record.creditCardId"
                      @dataReseaching="searchingFinanceRecord" />
                    <!-- <ui-buttonGroup showRemove :removeText="'刪除信用卡收支'" v-if="record.enable" /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="creditCardRecord.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCreditCardRecordList } from "@/server/creditCardRecordApi.ts";
import { ICreditCardRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index.ts";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";
import { messageToast } from "@/composables/swalDialog.ts";

declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "信用卡收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecord/accountRecordSearching.vue"),
);
const creditCardTradeData = defineAsyncComponent(
  () => import("@/components/financeRecord/creditCardRecord/creditCardTradeData.vue"),
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
const creditCardRecord = ref<ICreditCardRecordList[]>([]);
const creditCardRecordFiltered = ref<ICreditCardRecordList[]>([]);
const tableData = ref<ICreditCardRecordList[]>([]);

onMounted(() => {
  searchingFinanceRecord();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await creditCardRecordFilterEvent();
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
    const res: IResponse = await fetchCreditCardRecordList(searchingParams);
    console.log("res:", res.data.data);
    creditCardRecord.value = res.data.data;
    await creditCardRecordFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function creditCardRecordFilterEvent() {
  creditCardRecordFiltered.value = creditCardRecord.value;
  tableData.value = sliceArray(creditCardRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
