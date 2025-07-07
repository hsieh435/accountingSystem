<template>
  <div class="w-full">
    <div class="flex justify-start items-center">
      <financeRecordComponents-accountRecordSearching :accountTypeId="'cashCard'" :accountTypeName="'儲值票卡'" /> 
    </div>
    
    <div class="flex justify-start items-center mx-3 my-2">
      <financeRecordComponents-cashCardRecord-cashCardTradeData />
    </div>
    <div class="mx-5">
      <template v-if="cashCardTradeRecord.length > 0">
        <ui-pagination 
          :totalDataQuanity="cashCardTradeRecordFiltered.length"
          :showFilter="false">
        </ui-pagination>
        <template v-if="cashCardTradeRecordFiltered.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 text-left text-sm text-gray-600">NO.</th>
                  <th class="px-4 py-2 text-left text-sm text-gray-600">票卡名稱</th>
                  <th class="px-4 py-2 text-left text-sm text-gray-600">時間</th>
                  <th class="px-4 py-2 text-left text-sm text-gray-600">收支</th>
                  <th class="px-4 py-2 text-left text-sm text-gray-600">金額</th>
                  <th class="px-4 py-2 text-left text-sm text-gray-600">內容</th>
                  <th class="px-4 py-2 text-left text-sm text-gray-600 sticky right-0 bg-gray-100 z-10">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-gray-50" v-for="record in tableData" :key="record.tradeId">
                  <td class="px-4 py-2 text-sm text-gray-700">{{ record.no }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ record.cashCardName }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ record.incomingOutgoing }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ currencyFormat(record.tradeAmount) }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ record.tradeDescription }}</td>
                  <td class="px-4 py-2 text-sm text-blue-600 sticky right-0 bg-white z-10">
                    <financeRecordComponents-cashCardRecord-cashCardTradeData :tradeIdGot="record.tradeId" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="cashCardTradeRecord.length === 0">
        <div class="flex justify-start items-center h-full">
          <span class="text-gray-500">沒有帳戶資料</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashCardRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat } from "@/composables/tools";

declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "儲值票卡收支",
});

const cashCardTradeRecord = ref<ICashCardRecordList[]>([]);
const cashCardTradeRecordFiltered = ref<ICashCardRecordList[]>([]);
const tableData = ref<ICashCardRecordList[]>([]);
</script>
<style lang="scss" scoped></style>
