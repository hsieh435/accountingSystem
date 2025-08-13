<template>
  <div class="w-full px-3">
    <div class="flex flex-wrap justify-start items-center">
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <currencyAccountsData @dataReseaching="currencyAccountSearching()" />
    </div>

    <template v-if="currencyAccountList.length > 0">
      <ui-pagination
        :totalDataQuanity="currencyAccountList.length"
        :searchingPlaceholder="'搜尋帳戶名稱'"
        @tableSliceChange="settingTableSlice" />
      <template v-if="currencyAccountListFiltered.length > 0">
        <div :class="tailwindStyles.tableClasses">
          <div :class="tailwindStyles.theadClasses">
            <div :class="tailwindStyles.theadtrClasses">
              <div :class="tailwindStyles.thClasses">啟用</div>
              <div :class="tailwindStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.thClasses">帳戶名稱</div>
              <div :class="tailwindStyles.thClasses">銀行代號 / 銀行名稱</div>
              <div :class="tailwindStyles.thClasses">目前金額</div>
              <div :class="tailwindStyles.thClasses">薪資帳戶</div>
              <div :class="tailwindStyles.thClasses">建立時間</div>
              <div :class="tailwindStyles.thClasses">操作</div>
            </div>
          </div>
          <div :class="tailwindStyles.tbodyClasses">
            <div :class="tailwindStyles.tbodytrClasses" v-for="account in tableData" :key="account.accountId">
              <div :class="tailwindStyles.tdClasses">
                <ui-switch :switchValueGot="account.enable" @sendBackSwitchValue="(value: boolean) => { account.enable = value; adjustAbleStatus(account); }" />
              </div>
              <div :class="tailwindStyles.tdClasses">{{ account.no }}</div>
              <div :class="tailwindStyles.tdClasses">{{ account.accountName }}</div>
              <div :class="tailwindStyles.tdClasses">
                {{ account.accountBankCode }} / {{ account.accountBankName }}
              </div>
              <div :class="tailwindStyles.tdClasses">{{ account.presentAmount }}</div>
              <div :class="tailwindStyles.tdClasses">
                <i class="fa-solid fa-check mx-1" v-if="account.isSalaryAccount"></i>
              </div>
              <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(account.createdDate) }}</div>
              <div :class="tailwindStyles.tdClasses">
                <currencyAccountsData :currencyAccountIdGot="account.accountId" @dataReseaching="currencyAccountSearching()" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="currencyAccountList.length === 0">
      <span :class="tailwindStyles.noDataClasses">無帳戶資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCurrencyAccountList, fetchEnableCurrencyAccount, fetchDisableCurrencyAccount } from "@/server/currencyAccountApi";
import { IResponse, ICurrencyAccountList, IAccountSearchingParams } from "@/models/index";
import { sliceArray, yearMonthDayTimeFormat } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "存款帳戶資料設定",
});

const accountSearching = defineAsyncComponent(() => import("@/components/personalSettingComponents/accountSearching.vue"));
const currencyAccountsData = defineAsyncComponent(() => import("@/components/personalSettingComponents/currencyAccountsData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});
const currencyAccountList = ref<ICurrencyAccountList[]>([]);
const currencyAccountListFiltered = ref<ICurrencyAccountList[]>([]);
const tableData = ref<ICurrencyAccountList[]>([]);

onMounted(() => {
  currencyAccountSearching();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await currencyAccountListFilterEvent();
}

async function settingSearchingParams(params: IAccountSearchingParams) {
  searchingParams.currencyId = params.currencyId;
  await currencyAccountSearching();
}

async function currencyAccountSearching() {

  try {
    const res: IResponse = await fetchCurrencyAccountList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      currencyAccountList.value = res.data.data;
      await currencyAccountListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function currencyAccountListFilterEvent() {
  currencyAccountListFiltered.value = currencyAccountList.value;
  if (searchWord.value.length > 0) {
    currencyAccountListFiltered.value = currencyAccountListFiltered.value.filter((row: ICurrencyAccountList) => {
      return (
        row.accountName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.accountBankCode.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.accountBankName.toLowerCase().includes(searchWord.value.toLowerCase())
      );
    });
  }
  tableData.value = sliceArray(currencyAccountListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function adjustAbleStatus(card: ICurrencyAccountList) {

  try {
    const res: IResponse =
      await (card.enable === true ? fetchEnableCurrencyAccount : fetchDisableCurrencyAccount)(card.accountId);
    if (res.data.returnCode === 0) {
      showAxiosToast({ message: res.data.message });
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

</script>
<style lang="scss" scoped></style>
