<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <personalSettingComponents-cashCardSetting-cashCardData />
    </div>

    <div class="mx-5">
      <template v-if="cashCardList.length > 0">
        <ui-pagination 
          :totalDataQuanity="cashCardList.length"
          :searchingPlaceholder="'搜尋儲值票名稱'">
        </ui-pagination>
        <template v-if="cashCardListFiltered.length > 0">
          <table class="border-separate border border-gray-400 w-full table-fixed">
            <thead>
              <tr>
                <td class="border border-gray-300">NO.</td>
                <th class="border border-gray-300">票卡名稱</th>
                <th class="border border-gray-300">目前金額</th>
                <th class="border border-gray-300">最小儲值金額</th>
                <th class="border border-gray-300">最大儲值金額</th>
                <th class="border border-gray-300">建立時間</th>
                <th class="border border-gray-300">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="card in tableData" :key="card.cashCardId">
                <td class="border border-gray-300">{{ card.no }}</td>
                <td class="border border-gray-300">{{ card.cashCardName }}</td>
                <td class="border border-gray-300">{{ card.presentAmount }}</td>
                <td class="border border-gray-300">{{ card.minimumValueAllowed }}</td>
                <td class="border border-gray-300">{{ card.maximumValueAllowed }}</td>
                <td class="border border-gray-300">{{ card.createDate }}</td>
                <td class="border border-gray-300 flex justify-center items-center">
                  <personalSettingComponents-cashCardSetting-cashCardData :cashCardId="card.cashCardId" />
                  <ui-buttonGroup showRemove :createText="'刪除儲值票卡'" @dataRemove="removeAccountData()" />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else-if="cashCardList.length === 0">
          <div class="flex justify-start items-center h-full">
            <span class="text-gray-500">沒有儲值票卡資料</span>
          </div>
        </template>
      </template>
    </div>

    <!-- <personalSettingComponents-cashCardSetting-cashCardData :cashCardId="'123456'" /> -->
    <!-- <ui-buttonGroup showRemove :createText="'刪除儲值票卡'" @dataRemove="removeAccountData()" /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ICashCardList } from "@/models/index";

declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
});

const cashCardList = ref<any[]>([]);
const cashCardListFiltered = ref<ICashCardList[]>([]);
const tableData = ref<ICashCardList[]>([]);

const data = ref([
  {
    id: "4600",
    date: "2024-03-11T15:30:00",
    status: "paid",
    email: "james.anderson@example.com",
    amount: 594,
  },
  {
    id: "4599",
    date: "2024-03-11T10:10:00",
    status: "failed",
    email: "mia.white@example.com",
    amount: 276,
  },
  {
    id: "4598",
    date: "2024-03-11T08:50:00",
    status: "refunded",
    email: "william.brown@example.com",
    amount: 315,
  },
  {
    id: "4597",
    date: "2024-03-10T19:45:00",
    status: "paid",
    email: "emma.davis@example.com",
    amount: 529,
  },
  {
    id: "4596",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
  {
    id: "4595",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
  {
    id: "4594",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "ethan.harris@example.com",
    amount: 639,
  },
]);

cashCardList.value = data.value;

async function removeAccountData() {
  //
}
</script>
<style lang="scss" scoped></style>
