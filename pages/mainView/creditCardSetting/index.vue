<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <personalSettingComponents-creditCardSetting-creditCardData />
    </div>

    <div class="mx-5">
      <template v-if="creditCardList.length > 0">
        <ui-pagination
          :totalDataQuanity="creditCardList.length"
          :searchingPlaceholder="'搜尋信用卡名稱'" />
        <template v-if="creditCardListFiltered.length > 0">
          <table class="border-separate border border-gray-400 w-full table-fixed">
            <thead>
              <tr>
                <th class="border border-gray-300">信用卡名稱</th>
                <th class="border border-gray-300">發卡銀行代號 / 銀行名稱</th>
                <th class="border border-gray-300">發卡機構</th>
                <th class="border border-gray-300">每月額度</th>
                <th class="border border-gray-300">建立時間</th>
                <th class="border border-gray-300">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="card in tableData" :key="card.creditcardId">
                <td class="border border-gray-300">{{ card.creditcardName }}</td>
                <td class="border border-gray-300">{{ card.creditcardBankCode }} / {{ card.creditcardBankName }}</td>
                <td class="border border-gray-300">{{ card.creditcardScheme }}</td>
                <td class="border border-gray-300">{{ card.creditPerMonth }}</td>
                <td class="border border-gray-300">{{ card.createdDate }}</td>
                <td class="border border-gray-300 flex justify-center items-center">
                  <personalSettingComponents-creditCardSetting-creditCardData
                    :creditCardId="'123456'" />
                  <ui-buttonGroup showRemove :createText="'刪除信用卡'" @dataRemove="removeAccountData()" />
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </template>
      <template v-else-if="creditCardList.length === 0">
        <div class="flex justify-start items-center h-full">
          <span class="text-gray-500">沒有信用卡資料</span>
        </div>
      </template>
    </div>

    <!-- <personalSettingComponents-cashCardSetting-cashCardData :cashCardId="'123456'" /> -->
    <!-- <ui-buttonGroup showRemove :createText="'刪除信用卡'" @dataRemove="removeAccountData()" /> -->
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

async function removeAccountData() {
  //
}
</script>
<style lang="scss" scoped></style>
