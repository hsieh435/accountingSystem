<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <currencyAccountsData />
    </div>

    <div class="mx-5">
      <template v-if="currencyAccountList.length > 0">
        <ui-pagination
          :totalDataQuanity="currencyAccountList.length"
          :searchingPlaceholder="'搜尋帳戶名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="currencyAccountListFiltered.length > 0">
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">帳戶名稱</th>
                  <th :class="tailwindStyles.thClasses">銀行代號 / 銀行名稱</th>
                  <th :class="tailwindStyles.thClasses">目前金額</th>
                  <th :class="tailwindStyles.thClasses">薪資帳戶</th>
                  <th :class="tailwindStyles.thClasses">建立時間</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="account in tableData" :key="account.accountId">
                  <td :class="tailwindStyles.tdClasses">{{ account.no }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ account.accountName }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ account.accountBankCode }} / {{ account.accountBankName }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ account.presentAmount }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ account.isSalaryAccount }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ account.createdDate }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <currencyAccountsData :currencyAccountIdGot="account.accountId" />
                    <ui-buttonGroup showRemove :createText="'刪除帳戶'" @dataRemove="removeCurrencyAccountData()" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="currencyAccountList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無帳戶資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { ICurrencyAccountList } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "存款帳戶資料設定",
});



const currencyAccountsData = defineAsyncComponent(() => import("@/components/personalSettingComponents/currencyAccountsSetting/currencyAccountsData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const currencyAccountList = ref<ICurrencyAccountList[]>([]);
const currencyAccountListFiltered = ref<ICurrencyAccountList[]>([]);
const tableData = ref<ICurrencyAccountList[]>([]);



async function settingTableSlice(currentPageSendback: number, itemsPerPageSendback: number, keyWord: string) {
  currentPage.value = currentPageSendback;
  itemsPerPage.value = itemsPerPageSendback;
  searchWord.value = keyWord.trim();
  await currencyAccountListFilterEvent();
}



async function currencyAccountListFilterEvent() {
  currencyAccountListFiltered.value = searchWord.value.length > 0
  ? currencyAccountList.value.filter((row: ICurrencyAccountList) => {
    return row.accountName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.accountBankCode.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.accountBankName.toLowerCase().includes(searchWord.value.toLowerCase())
  })
  : currencyAccountList.value;
  
  tableData.value = sliceArray(currencyAccountListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function removeCurrencyAccountData() {
  //
}



</script>
<style lang="scss" scoped></style>
