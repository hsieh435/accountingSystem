<template>
  <div class="flex-col justify-start items-center">
    <accountSearching @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <currencyAccountsData @dataReseaching="currencyAccountSearching()" />
      <template v-if="currencyAccountList.length > 0">
        <ui-pagination
          :totalDataQuanity="currencyAccountList.length"
          :searchingPlaceholder="'搜尋帳戶名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyAccountListFiltered.length > 0">
          <div class="rounded-lg overflow-hidden p-0">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">啟用</div>
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">帳戶名稱</div>
                  <div :class="tailwindStyles.getThClasses()">銀行代號 / 銀行名稱</div>
                  <div :class="tailwindStyles.getThClasses()">目前金額</div>
                  <div :class="tailwindStyles.getThClasses()">提醒</div>
                  <div :class="tailwindStyles.getThClasses()">薪資帳戶</div>
                  <div :class="tailwindStyles.getThClasses()">建立時間</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div :class="tailwindStyles.getTbodytrClasses()" v-for="account in tableData" :key="account.accountId">
                  <div :class="tailwindStyles.getTdClasses()">
                    <ui-switch
                      :switchValueGot="account.enable"
                      @sendBackSwitchValue="
                        (value: boolean) => {
                          account.enable = value;
                          adjustAbleStatus(account);
                        }
                      " />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">{{ account.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ account.accountName }}</div>
                  <div :class="tailwindStyles.getTdClasses()"
                    >{{ account.accountBankCode }} / {{ account.accountBankName }}</div
                  >
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(account.presentAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="account.openAlert" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="account.isSalaryAccount" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(account.createdDate) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <currencyAccountsData
                      :currencyAccountIdGot="account.accountId"
                      @dataReseaching="currencyAccountSearching()" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="currencyAccountList.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無帳戶資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import {
  fetchCurrencyAccountList,
  fetchEnableCurrencyAccount,
  fetchDisableCurrencyAccount,
} from "@/server/currencyAccountApi";
import { IResponse, ICurrencyAccountList, IAccountSearchingParams } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "存款帳戶資料設定",
});

const accountSearching = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/accountSearching.vue"),
);
const currencyAccountsData = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/currencyAccountsData.vue"),
);

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
    console.log("fetchCurrencyAccountList:", res.data.data);
    if (res.data.returnCode === 0) {
      currencyAccountList.value = res.data.data;
      await currencyAccountListFilterEvent();
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
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

async function adjustAbleStatus(account: ICurrencyAccountList) {
  try {
    const res: IResponse = await (account.enable === true ? fetchEnableCurrencyAccount : fetchDisableCurrencyAccount)(
      account.accountId,
    );
    if (res.data.returnCode === 0) {
      messageToast({ message: res.data.message });
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
