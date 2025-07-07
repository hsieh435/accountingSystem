<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <personalSettingComponents-stockAccountSetting-stockAccountData />
    </div>

    <div class="mx-5">
      <template v-if="stockAccountList.length > 0">
        <ui-pagination
        :totalDataQuanity="stockAccountList.length"
        :searchingPlaceholder="'搜尋帳戶名稱'">
        </ui-pagination>
        <template v-if="stockAccountListFiltered.length > 0">
          <table class="border-separate border border-gray-400 w-full table-fixed">
            <thead>
              <tr>
                <th class="border border-gray-300">NO.</th>
                <th class="border border-gray-300">帳戶名稱</th>
                <th class="border border-gray-300">發卡銀行代號 / 銀行名稱</th>
                <th class="border border-gray-300">目前金額</th>
                <th class="border border-gray-300">建立時間</th>
                <th class="border border-gray-300">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in tableData" :key="account.accountId">
                <td class="border border-gray-300">{{ account.no }}</td>
                <td class="border border-gray-300">{{ account.accountName }}</td>
                <td class="border border-gray-300">{{ account.accountBankCode }} / {{ account.accountBankName }}</td>
                <td class="border border-gray-300">{{ account.presentAmount }}</td>
                <td class="border border-gray-300">{{ account.createdDate }}</td>
                <td class="border border-gray-300 flex justify-center items-center">
                  <personalSettingComponents-stockAccountSetting-stockAccountData :stockAccountIGot="account.accountId" />
                  <ui-buttonGroup showRemove :createText="'刪除帳戶'" @dataRemove="removeAccountData()" />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>
      <template v-else-if="stockAccountList.length === 0">
        <div class="flex justify-start items-center h-full">
          <span class="text-gray-500">沒有帳戶資料</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IStockAccountList } from "@/models/index";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "證券帳戶資料設定",
})



const stockAccountList = ref<IStockAccountList[]>([]);
const stockAccountListFiltered = ref<IStockAccountList[]>([]);
const tableData = ref<IStockAccountList[]>([]);


async function removeAccountData() {
  //
}
</script>
<style lang="scss" scoped></style>
