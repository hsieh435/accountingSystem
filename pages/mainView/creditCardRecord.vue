<template>
  <div class="flex-col justify-start items-center">
    <accountRecordSearching
      :accountTypeId="'isCreditcardAble'"
      :accountTypeName="'信用卡'"
      @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1"></div>
    <creditCardTradeData @dataReseaching="searchingFinanceRecord" />
  </div>
  <div class="px-3">
    <template v-if="creditCardRecord.length > 0">
      <ui-pagination
        :totalDataQuanity="creditCardRecordFiltered.length"
        :showFilter="false"
        @tableSliceChange="settingTableSlice" />
      <template v-if="creditCardRecordFiltered.length > 0">
        <div class="rounded-lg overflow-hidden p-0">
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
                <div :class="tailwindStyles.getTdClasses()">0</div>
                <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                <div :class="tailwindStyles.getTdClasses()">
                  <creditCardTradeData
                    :tradeIdGot="record.tradeId"
                    :creditCardIdGot="record.creditCardId"
                    @dataReseaching="searchingFinanceRecord" />
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
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCreditCardRecordList } from "@/server/creditCardRecordApi";
import { ICreditCardRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { errorMessageDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務收支",
  subTitle: "信用卡收支",
});

const accountRecordSearching = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/accountRecordSearching.vue"),
);
const creditCardTradeData = defineAsyncComponent(
  () => import("@/components/financeRecordComponents/creditCardRecord/creditCardTradeData.vue"),
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
  // console.log("params:", params);
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
    if (res.data.returnCode === 0) {
      creditCardRecord.value = res.data.data;
      await creditCardRecordFilterEvent();
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function creditCardRecordFilterEvent() {
  creditCardRecordFiltered.value = creditCardRecord.value;
  tableData.value = sliceArray(creditCardRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
