<template>
  <div class="w-full">
    <div class="flex flex-wrap justify-start items-center mx-3 my-2">
      <span>查詢貨幣：</span>
      <currencySelect @sendbackCurrencyId="settingCurrency" />
      <cashFlowSetting :currencyIdGot="currencyId" :isDisable="!currencyId || currencyArray.includes(currencyId)" @dataReseaching="cashFlowSearching()" />
    </div>

    <div class="mx-5 my-3">
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
                <div :class="tailwindStyles.tdClasses">
                  <currencySelect :currencyIdGot="cashFlow.currency" isDisable />
                </div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(cashFlow.startingAmount) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(cashFlow.presentAmount) }}</div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(cashFlow.alertValue) }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <font-awesome-icon class="mx-1" :icon="['fas', 'check']" v-if="cashFlow.openAlert" />
                </div>
                <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(cashFlow.createdDate) }}</div>
                <div :class="tailwindStyles.tdLastClasses">
                  <cashFlowSetting :cashflowIdIdGot="cashFlow.cashflowId" @dataReseaching="cashFlowSearching()" />
                  <ui-buttonGroup showRemove :removeText="'刪除現金流'" @dataRemove="removeCashFlowData(cashFlow.cashflowId)" />
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
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { fetchCashFlowList, fetchDeleteCashFlow } from "@/server/cashFlowApi";
import { IResponse, ICashFlowList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";



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
    const res = await fetchCashFlowList({ currencyId: currencyId.value }) as IResponse;
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




async function removeCashFlowData(cashflowId: string) {
  const confirmResult = await showConfirmDialog({
    message: "您確定要刪除這筆現金流資料嗎？",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchDeleteCashFlow,
    apiParams: cashflowId,
  });

  if (confirmResult) {
    await cashFlowSearching();
  }
}



</script>
<style lang="scss" scoped></style>
