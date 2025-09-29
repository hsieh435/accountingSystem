<template>
  <div class="flex-col justify-start items-center">
    <div>
      <accountRecordSearching
        :accountTypeId="'isCuaccountAble'"
        :accountTypeName="'存款帳戶'"
        @sendbackSearchingParams="settingSearchingParams" />
      <div class="my-1"></div>
      <currencyAccountTradeData @dataReseaching="searchingFinanceRecord" />
    </div>
    <div class="px-3">
      <template v-if="currencyAccountRecord.length > 0">
        <ui-pagination
          :totalDataQuanity="currencyAccountRecordFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyAccountRecordFiltered.length > 0">
          <div class="rounded-lg overflow-hidden p-0">
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
                  <div :class="tailwindStyles.getTdClasses()">{{ record.accountName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.transactionName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(record.tradeAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">0</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ record.tradeDescription }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <currencyAccountTradeData
                      :tradeIdGot="record.tradeId"
                      :accountIdGot="record.accountId"
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
import { fetchCurrencyAccountRecordList } from "@/server/currencyAccountRecordApi";
import { IcurrencyAccountRecordList, IFinanceRecordSearchingParams, IResponse } from "@/models/index";
import { getCurrentYear, yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { errorMessageDialog } from "@/composables/swalDialog";
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
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function currencyAccountRecordFilterEvent() {
  currencyAccountRecordFiltered.value = currencyAccountRecord.value;
  tableData.value = sliceArray(currencyAccountRecordFiltered.value, currentPage.value, itemsPerPage.value);
}
</script>
<style lang="scss" scoped></style>
