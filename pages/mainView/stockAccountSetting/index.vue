<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <personalSettingComponents-stockAccountSetting-stockAccountData />
    </div>

    <div class="mx-5">
      <template v-if="stockAccountList.length > 0">
        <ui-pagination
          :totalDataQuanity="stockAccountList.length"
          :searchingPlaceholder="'搜尋帳戶名稱'"
        />
        <template v-if="stockAccountListFiltered.length > 0">
          <div class="overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-200"
            >
              <thead class="bg-gray-100">
                <tr class="border border-gray-200">
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    NO.
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    帳戶名稱
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    發卡銀行代號 / 銀行名稱
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    目前金額
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    建立時間
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="hover:bg-gray-50 border border-gray-200"
                  v-for="account in tableData"
                  :key="account.accountId"
                >
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ account.no }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ account.accountName }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ account.accountBankCode }} /
                    {{ account.accountBankName }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ account.presentAmount }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ account.createdDate }}
                  </td>
                  <td
                    class="flex justify-center items-center text-sm text-gray-600 sticky right-0 z-10 px-4 py-2 border border-gray-200"
                  >
                    <personalSettingComponents-stockAccountSetting-stockAccountData
                      :stockAccountIGot="account.accountId"
                    />
                    <ui-buttonGroup
                      showRemove
                      :createText="'刪除帳戶'"
                      @dataRemove="removeStockAccountData()"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="stockAccountList.length === 0">
        <div class="flex justify-start items-center h-full text-gray-500">
          無帳戶資料
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
});

const stockAccountList = ref<IStockAccountList[]>([]);
const stockAccountListFiltered = ref<IStockAccountList[]>([]);
const tableData = ref<IStockAccountList[]>([]);

async function removeStockAccountData() {
  //
}
</script>
<style lang="scss" scoped></style>
