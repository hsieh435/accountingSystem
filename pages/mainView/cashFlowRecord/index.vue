<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <financeRecordComponents-cashFlowRecord-cashFlowTradeData />
    </div>
    <div class="mx-5">
      <template v-if="cashFlowRecord.length > 0">
        <ui-pagination 
          :totalDataQuanity="cashFlowRecordFiltered.length"
          :showFilter="false" />
        <template v-if="cashFlowRecordFiltered.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">NO.</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">日期時間</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">收支</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">項目</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">金額</th>
                  <!-- <th class="text-left text-sm text-gray-600 px-4 py-2">餘額</th> -->
                  <th class="text-left text-sm text-gray-600 px-4 py-2">內容</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2 sticky right-0 bg-gray-100 z-10">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-gray-50" v-for="record in tableData" :key="record.tradeId">
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.no }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.incomingOutgoing }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.tradeCategory }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.tradeAmount) }}</td>
                  <!-- <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.tradeAmount) }}</td> -->
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.tradeDescription }}</td>
                  <td class="text-sm text-blue-600 sticky right-0 bg-white z-10 px-4 py-2">
                    <financeRecordComponents-cashFlowRecord-cashFlowTradeData :tradeIdGot="record.tradeId" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="cashFlowRecord.length === 0">
        <div class="flex justify-start items-center h-full text-gray-500">無交易資料</div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashFlowRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat } from "@/composables/tools";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "現金收支",
});



const cashFlowRecord = ref<ICashFlowRecordList[]>([]);
const cashFlowRecordFiltered = ref<ICashFlowRecordList[]>([]);
const tableData = ref<ICashFlowRecordList[]>([]);

</script>
<style lang="scss" scoped></style>
