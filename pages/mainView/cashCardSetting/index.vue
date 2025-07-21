<template>
  <div class="w-full">
    <div class="flex justify-start items-center mx-3 my-2">
      <cashCardData />
    </div>

    <div class="mx-5">
      <template v-if="cashCardList.length > 0">
        <ui-pagination
          :totalDataQuanity="cashCardList.length"
          :searchingPlaceholder="'搜尋儲值票名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="cashCardListFiltered.length > 0">
          <div :class="tailwindStyles.tableClasses">
            <div :class="tailwindStyles.theadClasses">
              <div :class="tailwindStyles.theadtrClasses">
                <div :class="tailwindStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.thClasses">票卡名稱</div>
                <div :class="tailwindStyles.thClasses">使用貨幣</div>
                <div :class="tailwindStyles.thClasses">目前金額</div>
                <div :class="tailwindStyles.thClasses">最小儲值金額</div>
                <div :class="tailwindStyles.thClasses">最大儲值金額</div>
                <div :class="tailwindStyles.thClasses">建立時間</div>
                <div :class="tailwindStyles.thClasses">操作</div>
              </div>
              <div :class="tailwindStyles.tbodyClasses">
                <div :class="tailwindStyles.tbodytrClasses" v-for="card in tableData" :key="card.cashCardId">
                  <div :class="tailwindStyles.tdClasses">{{ card.no }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ card.cashCardName }}</div>
                  <div :class="tailwindStyles.tdClasses"></div>
                  <div :class="tailwindStyles.tdClasses">{{ card.presentAmount }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ card.minimumValueAllowed }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ card.maximumValueAllowed }}</div>
                  <div :class="tailwindStyles.tdClasses">{{ card.createDate }}</div>
                  <div :class="tailwindStyles.tdLastClasses">
                    <cashCardData :cashCardId="card.cashCardId" />
                    <ui-buttonGroup showRemove :createText="'刪除儲值票卡'" @dataRemove="removeCashCard()" />
                  </div>
                </div>
              </div>
            </div>
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
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
});



const cashCardData = defineAsyncComponent(() => import("@/components/personalSettingComponents/cashCardSetting/cashCardData.vue"));



const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const cashCardList = ref<any[]>([]);
const cashCardListFiltered = ref<ICashCardList[]>([]);
const tableData = ref<ICashCardList[]>([]);



async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await cashCardListFilterEvent();
}



async function cashCardListFilterEvent() {
  // cashCardList.value = data.value;
  // cashCardListFiltered.value = cashCardList.value;
  // tableData.value = cashCardListFiltered.value;
  
  cashCardListFiltered.value = searchWord.value.length > 0
  ? cashCardList.value.filter((row: ICashCardList) => {
    return row.cashCardName.toLowerCase().includes(searchWord.value.toLowerCase())
  })
  : cashCardList.value;
  
  tableData.value = sliceArray(cashCardListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function removeCashCard() {
  //
}
</script>
<style lang="scss" scoped></style>
