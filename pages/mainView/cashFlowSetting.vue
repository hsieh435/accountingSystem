<template>
  <div class="flex-col justify-start items-center">
    <accountSearching @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <cashFlowData @dataReseaching="cashFlowSearching()" />
      <template v-if="cashFlowList.length > 0">
        <ui-pagination
          :totalDataQuanity="cashFlowListFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="cashFlowListFiltered.length > 0">
          <div class="rounded-lg overflow-auto">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">啟用</div>
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">現金流名稱</div>
                  <div :class="tailwindStyles.getThClasses()">貨幣</div>
                  <div :class="tailwindStyles.getThClasses()">初始金額</div>
                  <div :class="tailwindStyles.getThClasses()">目前金額</div>
                  <div :class="tailwindStyles.getThClasses()">提醒金額</div>
                  <div :class="tailwindStyles.getThClasses()">提醒</div>
                  <div :class="tailwindStyles.getThClasses()">建立時間</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div
                  :class="tailwindStyles.getTbodytrClasses()"
                  v-for="cashFlow in tableData"
                  :key="cashFlow.cashflowId">
                  <div :class="tailwindStyles.getTdClasses()">
                    <USwitch v-model="cashFlow.enable" @change="adjustAbleStatus(cashFlow)" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">{{ cashFlow.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ cashFlow.cashflowName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ cashFlow.currencyName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(cashFlow.startingAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(cashFlow.presentAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(cashFlow.alertValue) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon :icon="['fas', 'check']" v-if="cashFlow.openAlert" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(cashFlow.createdDate) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <cashFlowData :cashflowIdIdGot="cashFlow.cashflowId" @dataReseaching="cashFlowSearching()" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="cashFlowList.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無現金流資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCashFlowList, fetchEnableCashFlow, fetchDisableCashFlow } from "@/server/cashFlowApi.ts";
import { IResponse, ICashFlowList, IAccountSearchingParams } from "@/models/index.ts";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";
import { messageToast } from "@/composables/swalDialog.ts";

declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "現金資料設定",
});

const accountSearching = defineAsyncComponent(() => import("@/components/personalSetting/accountSearching.vue"));
const cashFlowData = defineAsyncComponent(() => import("@/components/personalSetting/cashFlowData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const cashFlowList = ref<ICashFlowList[]>([]);
const cashFlowListFiltered = ref<ICashFlowList[]>([]);
const tableData = ref<ICashFlowList[]>([]);
const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});

onMounted(() => {
  cashFlowSearching();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await cashFlowListFilterEvent();
}

async function settingSearchingParams(params: IAccountSearchingParams) {
  searchingParams.currencyId = params.currencyId;
  await cashFlowSearching();
}

async function cashFlowSearching() {
  try {
    const res: IResponse = await fetchCashFlowList(searchingParams);
    // console.log("res:", res.data.data);
    cashFlowList.value = res.data.data;
    await cashFlowListFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function cashFlowListFilterEvent() {
  cashFlowListFiltered.value = cashFlowList.value;
  tableData.value = sliceArray(cashFlowListFiltered.value, currentPage.value, itemsPerPage.value);
}

async function adjustAbleStatus(card: ICashFlowList) {
  try {
    const res: IResponse = await (card.enable === true ? fetchEnableCashFlow : fetchDisableCashFlow)(card.cashflowId);
    messageToast({ message: res.data.message });
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
