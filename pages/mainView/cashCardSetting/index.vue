<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <cashCardData />
    </div>

    <div class="mx-5">
      <template v-if="cashCardList.length > 0">
        <ui-pagination
          :totalDataQuanity="cashCardList.length"
          :searchingPlaceholder="'搜尋儲值票名稱'" />
        <template v-if="cashCardListFiltered.length > 0">
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <td :class="tailwindStyles.thClasses">NO.</td>
                  <th :class="tailwindStyles.thClasses">票卡名稱</th>
                  <th :class="tailwindStyles.thClasses">目前金額</th>
                  <th :class="tailwindStyles.thClasses">最小儲值金額</th>
                  <th :class="tailwindStyles.thClasses">最大儲值金額</th>
                  <th :class="tailwindStyles.thClasses">建立時間</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="card in tableData" :key="card.cashCardId">
                  <td :class="tailwindStyles.tdClasses">{{ card.no }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.cashCardName }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.presentAmount }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.minimumValueAllowed }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.maximumValueAllowed }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.createDate }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <cashCardData :cashCardId="card.cashCardId" />
                    <ui-buttonGroup showRemove :createText="'刪除儲值票卡'" @dataRemove="removeCashCard()" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="cashCardList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無儲值票卡資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { ICashCardList } from "@/models/index";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
});



const cashCardData = defineAsyncComponent(() => import("@/components/personalSettingComponents/cashCardSetting/cashCardData.vue"));



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

// cashCardList.value = data.value;
// cashCardListFiltered.value = cashCardList.value;
// tableData.value = cashCardListFiltered.value;

async function removeCashCard() {
  //
}
</script>
<style lang="scss" scoped></style>
