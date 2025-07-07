
<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <financeRecordComponents-stockAccountRecord-stockAccountTradeData :accountTypeId="'stockAccount'" :accountTypeName="'證券帳戶'" />
    </div>

    <div class="flex justify-start items-center mx-3 my-2">
      <financeRecordComponents-stockAccountRecord-stockAccountTradeData />
    </div>
    <div class="mx-5">
      <template v-if="stockAccountRecord.length > 0">
        <ui-pagination 
          :totalDataQuanity="stockAccountRecordFiltered.length"
          :showFilter="false" />
        <template v-if="stockAccountRecordFiltered.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">NO.</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">日期時間</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">買/賣</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">股票</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">金額</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">股數</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">手續費</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">交易稅</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">交易總額</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">帳戶餘額</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2">內容</th>
                  <th class="text-left text-sm text-gray-600 px-4 py-2 sticky right-0 bg-gray-100 z-10">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr class="hover:bg-gray-50" v-for="record in tableData" :key="record.tradeId">
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.no }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ yearMonthDayTimeFormat(record.tradeDatetime) }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.incomingOutgoing }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.stockNo }} / {{ record.stockName }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.pricePerShare) }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.quantity) }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.handlingFee) }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.transactionTax) }}</td>
                  <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.totalPrice) }}</td>
                  <!-- <td class="text-sm text-gray-700 px-4 py-2">{{ currencyFormat(record.totalPrice) }}</td> -->
                  <td class="text-sm text-gray-700 px-4 py-2">{{ record.tradeDescription }}</td>
                  <td class="text-sm text-blue-600 sticky right-0 bg-white z-10 px-4 py-2">
                    <financeRecordComponents-stockAccountRecord-stockAccountTradeData :tradeIdGot="record.tradeId" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="stockAccountRecord.length === 0">
        <div class="flex justify-start items-center h-full text-gray-500">無交易資料</div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { IStockAccountRecordList } from "@/models/index";
import { yearMonthDayTimeFormat, currencyFormat } from "@/composables/tools";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "財務收支",
  subTitle: "證券帳戶收支",
})



const stockAccountRecord = ref<IStockAccountRecordList[]>([]);
const stockAccountRecordFiltered = ref<IStockAccountRecordList[]>([]);
const tableData = ref<IStockAccountRecordList[]>([]);

</script>
<style lang="scss" scoped></style>
