<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <span>查詢貨幣：</span>
      <currencySelect @sendbackCurrencyId="settingCurrency" />
      <cashFlowSetting :currencyIdGot="currencyId" :isDisable="!currencyId || currencyArray.includes(currencyId)" @dataReseaching="cashFlowSearching()" />
      <!-- <ui-buttonGroup showCreate :createText="'新增現金流'" @dataCreate="cashFlowCreating()" :createDisable="!currencyId || currencyArray.includes(currencyId)" /> -->
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
              <div :class="tailwindStyles.thClasses">警示餘額</div>
              <div :class="tailwindStyles.thClasses">警示</div>
              <div :class="tailwindStyles.thClasses">建立時間</div>
              <div :class="tailwindStyles.thClasses">操作</div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="cashFlow in tableData" :key="cashFlow.cashflowId">
                <div :class="tailwindStyles.tdClasses">{{ cashFlow.no }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <currencySelect :currencyIdGot="cashFlow.currency" isDisable />
                </div>
                <div :class="tailwindStyles.tdClasses">
                  {{ currencyFormat(cashFlow.startingAmount) + cashFlow.currency }}
                </div>
                <div :class="tailwindStyles.tdClasses">
                  {{ currencyFormat(cashFlow.presentAmount) + cashFlow.currency }}
                </div>
                <div :class="tailwindStyles.tdClasses">
                  {{ currencyFormat(cashFlow.alertValue) + cashFlow.currency }}
                </div>
                <div :class="tailwindStyles.tdClasses">
                  <font-awesome-icon class="mx-1" :icon="['fas', 'check']" v-if="cashFlow.openAlert" />
                </div>
                <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(cashFlow.createDate) }}</div>
                <div :class="tailwindStyles.tdLastClasses">
                  <cashFlowSetting :cashflowIdIdGot="cashFlow.cashflowId" :currencyIdGot="cashFlow.currency" @dataReseaching="cashFlowSearching()" />
                </div>
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
import { fetchCurrencyList, fetchCreateCashFlow } from "@/server/cashFlowApi";
import { IResponse, ICashFlowList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "現金資料設定",
});



const currencySelect = defineAsyncComponent(() => import("@/components/ui/select/currencySelect.vue"));
const cashFlowSetting = defineAsyncComponent(() => import("@/components/personalSettingComponents/cashFlowSetting/index.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);


const currencyId = ref<string>("");
const currencyArray = ref<string[]>([]);
const cashFlowList = ref<ICashFlowList[]>([]);
const cashFlowListFiltered = ref<ICashFlowList[]>([]);
const tableData = ref<ICashFlowList[]>([]);



onMounted(() => {
  cashFlowSearching();
});



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await cashFlowListFilterEvent();
}




async function settingCurrency(currencyIdSendback: string) {
  currencyId.value = currencyIdSendback;
  await cashFlowSearching()
}



async function cashFlowSearching() {
  currencyArray.value = [];

  try {
    const res = await fetchCurrencyList({ currencyId: currencyId.value }) as IResponse;
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      cashFlowList.value = res.data.data;
      for (const item of cashFlowList.value) {
        currencyArray.value.push(item.currency);
      }
      await cashFlowListFilterEvent();
    } else {
      console.error("Error fetching cash flow list:", res.data.message);
    }
  } catch (error) {
    console.error("Error in cashFlowSearching:", (error as Error).message);
  }
}



async function cashFlowListFilterEvent() {
  cashFlowListFiltered.value = cashFlowList.value.filter(item => item.currency === currencyId.value);
  tableData.value = sliceArray(cashFlowListFiltered.value, currentPage.value, itemsPerPage.value);
}



</script>
<style lang="scss" scoped></style>
