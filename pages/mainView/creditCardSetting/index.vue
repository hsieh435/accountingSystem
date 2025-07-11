<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <creditCardData :userIdGot="''" />
    </div>

    <div class="mx-5">
      <template v-if="creditCardList.length > 0">
        <ui-pagination
          :totalDataQuanity="creditCardList.length"
          :searchingPlaceholder="'搜尋信用卡名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="creditCardListFiltered.length > 0">
          <div class="overflow-x-auto">
            <table :class="tailwindStyles.tableClasses">
              <thead :class="tailwindStyles.theadClasses">
                <tr :class="tailwindStyles.trClasses">
                  <th :class="tailwindStyles.thClasses">NO.</th>
                  <th :class="tailwindStyles.thClasses">信用卡名稱</th>
                  <th :class="tailwindStyles.thClasses">發卡銀行代號 / 銀行名稱</th>
                  <th :class="tailwindStyles.thClasses">發卡機構</th>
                  <th :class="tailwindStyles.thClasses">每月額度</th>
                  <th :class="tailwindStyles.thClasses">建立時間</th>
                  <th :class="tailwindStyles.thLastClasses">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr :class="tailwindStyles.trClasses" v-for="card in tableData" :key="card.creditcardId">
                  <td :class="tailwindStyles.tdClasses">{{ card.no }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.creditcardName }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.creditcardBankCode }} / {{ card.creditcardBankName }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.creditcardSchema }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.creditPerMonth }}</td>
                  <td :class="tailwindStyles.tdClasses">{{ card.createdDate }}</td>
                  <td :class="tailwindStyles.tdLastClasses">
                    <creditCardData :creditCardIdGot="card.creditcardId" :userIdGot="''" />
                    <ui-buttonGroup showRemove :createText="'刪除信用卡'" @dataRemove="removeCreditcardData()" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else-if="creditCardList.length === 0">
        <span :class="tailwindStyles.noDataClasses">無信用卡資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { ICreditCardList } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  functionTitle: "個人設定",
  subTitle: "信用卡資料設定",
});



const creditCardData = defineAsyncComponent(() => import("@/components/personalSettingComponents/creditCardSetting/creditCardData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const creditCardList = ref<any[]>([]);
const creditCardListFiltered = ref<ICreditCardList[]>([]);
const tableData = ref<ICreditCardList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await creditCardListFilterEvent();
}



async function creditCardListFilterEvent() {
  creditCardListFiltered.value = searchWord.value.length > 0
  ? creditCardList.value.filter((row: ICreditCardList) => {
    return row.creditcardName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.creditcardBankName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.creditcardBankCode.toLowerCase().includes(searchWord.value.toLowerCase()) ||
    row.creditcardSchema.toLowerCase().includes(searchWord.value.toLowerCase())
  })
  : creditCardList.value;
  
  tableData.value = sliceArray(creditCardListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function removeCreditcardData() {
  //
}
</script>
<style lang="scss" scoped></style>
