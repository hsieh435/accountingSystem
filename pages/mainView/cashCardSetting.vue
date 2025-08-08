<template>
  <div class="w-full px-3">
    <div class="flex flex-wrap justify-start items-center">
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <cashCardData />
    </div>

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
                <div :class="tailwindStyles.tdClasses">{{ card.createdDate }}</div>
                <div :class="tailwindStyles.tdClasses">
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
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { IResponse, ICashCardList, IAccountSearchingParams } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
});

const accountSearching = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/accountSearching.vue"),
);
const cashCardData = defineAsyncComponent(() => import("@/components/personalSettingComponents/cashCardData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});
const cashCardList = ref<any[]>([]);
const cashCardListFiltered = ref<ICashCardList[]>([]);
const tableData = ref<ICashCardList[]>([]);

onMounted(() => {
  cashCardSearching();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await cashCardListFilterEvent();
}

async function settingSearchingParams(params: IAccountSearchingParams) {
  searchingParams.currencyId = params.currencyId;
  await cashCardSearching();
}

async function cashCardSearching() {
  //
}

async function cashCardListFilterEvent() {
  // cashCardList.value = data.value;
  // cashCardListFiltered.value = cashCardList.value;
  // tableData.value = cashCardListFiltered.value;

  cashCardListFiltered.value = cashCardList.value;
  if (searchWord.value.length > 0) {
    cashCardListFiltered.value = cashCardListFiltered.value.filter((row: ICashCardList) => {
      return row.cashCardName.toLowerCase().includes(searchWord.value.toLowerCase());
    });
  }

  tableData.value = sliceArray(cashCardListFiltered.value, currentPage.value, itemsPerPage.value);
}

async function removeCashCard() {
  //
}
</script>
<style lang="scss" scoped></style>
