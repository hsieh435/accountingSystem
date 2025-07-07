<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <personalSettingComponents-creditCardSetting-creditCardData
        :userIdGot="''"
      />
    </div>

    <div class="mx-5">
      <template v-if="creditCardList.length > 0">
        <ui-pagination
          :totalDataQuanity="creditCardList.length"
          :searchingPlaceholder="'搜尋信用卡名稱'"
        />
        <template v-if="creditCardListFiltered.length > 0">
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
                    信用卡名稱
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    發卡銀行代號 / 銀行名稱
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    發卡機構
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    發卡機構
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    每月額度
                  </th>
                  <th
                    class="text-left text-sm text-gray-600 px-4 py-2 border border-gray-200"
                  >
                    每月額度
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
                  v-for="card in tableData"
                  :key="card.creditcardId"
                >
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ card.no }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ card.creditcardName }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ card.creditcardBankCode }} /
                    {{ card.creditcardBankName }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ card.creditcardScheme }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ card.creditPerMonth }}
                  </td>
                  <td
                    class="text-sm text-gray-700 px-4 py-2 border border-gray-200"
                  >
                    {{ card.createdDate }}
                  </td>
                  <td
                    class="flex justify-center items-center text-sm text-gray-600 sticky right-0 z-10 px-4 py-2 border border-gray-200"
                  >
                    <personalSettingComponents-creditCardSetting-creditCardData
                      :creditCardIdGot="card.creditcardId"
                      :userIdGot="''"
                    />
                    <ui-buttonGroup
                      showRemove
                      :createText="'刪除信用卡'"
                      @dataRemove="removeCreditcardData()"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="creditCardList.length === 0">
        <div class="flex justify-start items-center h-full text-gray-500">
          無信用卡資料
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICreditCardList } from "@/models/index";

declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "信用卡資料設定",
});

const creditCardList = ref<any[]>([]);
const creditCardListFiltered = ref<ICreditCardList[]>([]);
const tableData = ref<ICreditCardList[]>([]);

async function removeCreditcardData() {
  //
}
</script>
<style lang="scss" scoped></style>
