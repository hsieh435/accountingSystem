<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <stockAccountData />
    </div>

    <div class="mx-5">
      <template v-if="stockAccountList.length > 0">
        <ui-pagination
          :totalDataQuanity="stockAccountList.length"
          :searchingPlaceholder="'搜尋帳戶名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="stockAccountListFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">帳戶名稱</div>
                <div :class="tailwindStyles.thClasses">發卡銀行代號 / 銀行名稱</div>
                <div :class="tailwindStyles.thClasses">目前金額</div>
                <div :class="tailwindStyles.thClasses">建立時間</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tbodyClasses">
              <div :class="tailwindStyles.tbodytrClasses" v-for="account in tableData" :key="account.accountId">
                <div :class="tailwindStyles.tdClasses">{{ account.no }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.accountName }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.accountBankCode }} / {{ account.accountBankName }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.presentAmount }}</div>
                <div :class="tailwindStyles.tdClasses">{{ account.createdDate }}</div>
                <div :class="tailwindStyles.tdClasses">
                  <stockAccountData :stockAccountIGot="account.accountId" />
                  <ui-buttonGroup showRemove :createText="'刪除帳戶'" @dataRemove="removeStockAccountData()" />
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
import { defineAsyncComponent, ref } from "vue";
import { IStockAccountList } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "證券帳戶資料設定",
});



const stockAccountData = defineAsyncComponent(() => import("@/components/personalSettingComponents/stockAccountData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const stockAccountList = ref<IStockAccountList[]>([]);
const stockAccountListFiltered = ref<IStockAccountList[]>([]);
const tableData = ref<IStockAccountList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await stockAccountListFilterEvent();
}



async function stockAccountListFilterEvent() {
  stockAccountListFiltered.value = searchWord.value.length > 0
  ? stockAccountList.value.filter((row: IStockAccountList) => {
    return row.accountName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.accountBankCode.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.accountBankName.toLowerCase().includes(searchWord.value.toLowerCase())
  })
  : stockAccountList.value;
  
  tableData.value = sliceArray(stockAccountListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function removeStockAccountData() {
  //
}



</script>
<style lang="scss" scoped></style>
