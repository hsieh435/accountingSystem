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
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">帳戶名稱</th>
                  <th :class="tailwindStyles.thClasses">發卡銀行代號 / 銀行名稱</th>
                  <th :class="tailwindStyles.thClasses">目前金額</th>
                  <th :class="tailwindStyles.thClasses">建立時間</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="account in tableData" :key="account.accountId">
                  <td :class="tailwindStyles.thClasses">{{ account.no }}</td>
                  <td :class="tailwindStyles.thClasses">{{ account.accountName }}</td>
                  <td :class="tailwindStyles.thClasses">{{ account.accountBankCode }} / {{ account.accountBankName }}</td>
                  <td :class="tailwindStyles.thClasses">{{ account.presentAmount }}</td>
                  <td :class="tailwindStyles.thClasses">{{ account.createdDate }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <stockAccountData :stockAccountIGot="account.accountId" />
                    <ui-buttonGroup showRemove :createText="'刪除帳戶'" @dataRemove="removeStockAccountData()" />
                  </td>
                </tr>
              </tbody>
            </table>
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
  functionTitle: "個人設定",
  subTitle: "證券帳戶資料設定",
});



const stockAccountData = defineAsyncComponent(() => import("@/components/personalSettingComponents/stockAccountSetting/stockAccountData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const stockAccountList = ref<IStockAccountList[]>([]);
const stockAccountListFiltered = ref<IStockAccountList[]>([]);
const tableData = ref<IStockAccountList[]>([]);



async function settingTableSlice(currentPageSendback: number, itemsPerPageSendback: number, keyWord: string) {
  currentPage.value = currentPageSendback;
  itemsPerPage.value = itemsPerPageSendback;
  searchWord.value = keyWord.trim();
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
