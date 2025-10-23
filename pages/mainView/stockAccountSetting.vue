<template>
  <div class="flex-col justify-start items-center">
    <accountSearching @sendbackSearchingParams="settingSearchingParams" />

    <div class="my-1 px-3">
      <stockAccountData @dataReseaching="stockAccountSearching" />
      <template v-if="stockAccountList.length > 0">
        <ui-pagination
          :totalDataQuanity="stockAccountList.length"
          :searchingPlaceholder="'搜尋帳戶名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="stockAccountListFiltered.length > 0">
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
                  <div :class="tailwindStyles.getTdClasses()">
                    {{ account.accountBankCode }} / {{ account.accountBankName }}
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">{{ currencyFormat(account.presentAmount) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <UIcon name="i-fa7-solid:check" v-if="account.openAlert" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">{{ yearMonthDayTimeFormat(account.createdDate) }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <stockAccountData :stockAccountIGot="account.accountId" @dataReseaching="stockAccountSearching" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="stockAccountList.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無帳戶資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchStockAccountList, fetchEnableStockAccount, fetchDisableStockAccount } from "@/server/stockAccountApi";
import { IResponse, IStockAccountList, IAccountSearchingParams } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat, sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { messageToast, errorMessageDialog } from "@/composables/swalDialog";

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
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
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
