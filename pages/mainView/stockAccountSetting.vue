<template>
  <div class="flex-col justify-start items-center">
    <div>
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <div class="my-1"></div>
      <stockAccountData @dataReseaching="stockAccountSearching" />
    </div>

    <div class="px-3">
      <template v-if="stockAccountList.length > 0">
        <ui-pagination
          :totalDataQuanity="stockAccountList.length"
          :searchingPlaceholder="'搜尋帳戶名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="stockAccountListFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">啟用</div>
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">帳戶名稱</div>
                <div :class="tailwindStyles.thClasses">銀行代號 / 銀行名稱</div>
                <div :class="tailwindStyles.thClasses">目前金額</div>
                <div :class="tailwindStyles.thClasses">提醒</div>
                <div :class="tailwindStyles.thClasses">建立時間</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="account in tableData" :key="account.accountId">
                <div :class="tailwindStyles.tdClasses">
                  <ui-switch
                    :switchValueGot="account.enable"
                    @sendBackSwitchValue="
                      (value: boolean) => {
                        account.enable = value;
                        adjustAbleStatus(account);
                      }
                    " />
                </div>
                <div :class="tailwindStyles.tdClasses">{{ account.no }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.accountName }}</div>
                <div :class="tailwindStyles.tdClasses">
                  {{ account.accountBankCode }} / {{ account.accountBankName }}
                </div>
                <div :class="tailwindStyles.tdClasses">{{ currencyFormat(account.presentAmount) }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <font-awesome-icon icon="check" v-if="account.openAlert" />
                </div>
                <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(account.createdDate) }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <stockAccountData :stockAccountIGot="account.accountId" @dataReseaching="stockAccountSearching" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="stockAccountList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無帳戶資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchStockAccountList, fetchEnableStockAccount, fetchDisableStockAccount } from "@/server/stockAccountApi";
import { IResponse, IStockAccountList, IAccountSearchingParams } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "證券帳戶資料設定",
});

const accountSearching = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/accountSearching.vue"),
);
const stockAccountData = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/stockAccountData.vue"),
);

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});
const stockAccountList = ref<IStockAccountList[]>([]);
const stockAccountListFiltered = ref<IStockAccountList[]>([]);
const tableData = ref<IStockAccountList[]>([]);

onMounted(() => {
  stockAccountSearching();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await stockAccountListFilterEvent();
}

async function settingSearchingParams(params: IAccountSearchingParams) {
  searchingParams.currencyId = params.currencyId;
  await stockAccountSearching();
}

async function stockAccountSearching() {
  // console.log("searchingParams:", searchingParams);

  try {
    const res: IResponse = await fetchStockAccountList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      stockAccountList.value = res.data.data;
      await stockAccountListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function stockAccountListFilterEvent() {
  stockAccountListFiltered.value = stockAccountList.value;
  if (searchWord.value.length > 0) {
    stockAccountListFiltered.value = stockAccountListFiltered.value.filter((row: IStockAccountList) => {
      return (
        row.accountName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.accountBankCode.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.accountBankName.toLowerCase().includes(searchWord.value.toLowerCase())
      );
    });
  }

  tableData.value = sliceArray(stockAccountListFiltered.value, currentPage.value, itemsPerPage.value);
}

async function adjustAbleStatus(account: IStockAccountList) {
  try {
    const res: IResponse = await (account.enable === true ? fetchEnableStockAccount : fetchDisableStockAccount)(
      account.accountId,
    );
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
