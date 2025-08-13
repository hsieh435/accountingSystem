<template>
  <div class="w-full px-3">
    <div class="flex flex-wrap justify-start items-center">
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <cashFlowData
        :currencyIdGot="searchingParams.currencyId"
        :isDisable="!searchingParams.currencyId || currencyArray.includes(searchingParams.currencyId)"
        @dataReseaching="cashFlowSearching()" />
    </div>

    <template v-if="cashFlowList.length > 0">
      <ui-pagination
        :totalDataQuanity="cashFlowListFiltered.length"
        :showFilter="false"
        @tableSliceChange="settingTableSlice" />
      <template v-if="cashFlowListFiltered.length > 0">
        <div :class="tailwindStyles.tableClasses">
          <div :class="tailwindStyles.theadClasses">
            <div :class="tailwindStyles.theadtrClasses">
              <div :class="tailwindStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.thClasses">貨幣</div>
              <div :class="tailwindStyles.thClasses">初始金額</div>
              <div :class="tailwindStyles.thClasses">目前金額</div>
              <div :class="tailwindStyles.thClasses">提醒金額</div>
              <div :class="tailwindStyles.thClasses">提醒</div>
              <div :class="tailwindStyles.thClasses">建立時間</div>
              <div :class="tailwindStyles.thClasses">操作</div>
            </div>
          </div>
          <div :class="tailwindStyles.tbodyClasses">
            <div :class="tailwindStyles.tbodytrClasses" v-for="cashFlow in tableData" :key="cashFlow.cashflowId">
              <div :class="tailwindStyles.tdClasses">{{ cashFlow.no }}</div>
              <div :class="tailwindStyles.tdClasses">{{ cashFlow.currencyName }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(cashFlow.startingAmount) }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(cashFlow.presentAmount) }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(cashFlow.alertValue) }}</div>
              <div :class="tailwindStyles.tdClasses">
                <font-awesome-icon class="mx-1" :icon="['fas', 'check']" v-if="cashFlow.openAlert" />
              </div>
              <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(cashFlow.createdDate) }}</div>
              <div :class="tailwindStyles.tdClasses">
                <cashFlowData :cashflowIdIdGot="cashFlow.cashflowId" @dataReseaching="cashFlowSearching()" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="cashFlowList.length === 0">
      <span :class="tailwindStyles.noDataClasses">無現金流資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCashFlowList } from "@/server/cashFlowApi";
import { IResponse, ICashFlowList, IAccountSearchingParams } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "現金資料設定",
});

const accountSearching = defineAsyncComponent(() => import("@/components/personalSettingComponents/accountSearching.vue"));
const cashFlowData = defineAsyncComponent(() => import("@/components/personalSettingComponents/cashFlowData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const currencyArray = ref<string[]>([]);
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
  currencyArray.value = [];

  try {
    const res: IResponse = await fetchCashFlowList(searchingParams);
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      cashFlowList.value = res.data.data;
      for (const item of cashFlowList.value) {
        currencyArray.value.push(item.currency);
      }
      await cashFlowListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function cashFlowListFilterEvent() {
  cashFlowListFiltered.value = cashFlowList.value;
  tableData.value = sliceArray(cashFlowListFiltered.value, currentPage.value, itemsPerPage.value);
}



</script>
<style lang="scss" scoped></style>
