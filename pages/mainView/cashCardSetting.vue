<template>
  <div class="w-full px-3">
    <div class="flex flex-wrap justify-start items-center">
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <cashCardData @dataReseaching="cashCardSearching" />
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
              <div :class="tailwindStyles.thClasses">啟用</div>
              <div :class="tailwindStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.thClasses">票卡名稱</div>
              <div :class="tailwindStyles.thClasses">使用貨幣</div>
              <div :class="tailwindStyles.thClasses">目前金額</div>
              <div :class="tailwindStyles.thClasses">最小儲值金額</div>
              <div :class="tailwindStyles.thClasses">最大儲值金額</div>
              <div :class="tailwindStyles.thClasses">建立時間</div>
              <div :class="tailwindStyles.thClasses">操作</div>
            </div>
          </div>
          <div :class="tailwindStyles.tbodyClasses">
            <div :class="tailwindStyles.tbodytrClasses" v-for="card in tableData" :key="card.cashcardId">
              <div :class="tailwindStyles.tdClasses">
                <ui-switch :switchValueGot="card.enable" @sendBackSwitchValue="(value: boolean) => { card.enable = value; adjustAbleStatus(card); }" />
              </div>
              <div :class="tailwindStyles.tdClasses">{{ card.no }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.cashcardName }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.currencyName }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(card.presentAmount) }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(card.minimumValueAllowed) }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(card.maximumValueAllowed) }}</div>
              <div :class="tailwindStyles.tdClasses">{{ yearMonthDayTimeFormat(card.createdDate) }}</div>
              <div :class="tailwindStyles.tdClasses">
                <cashCardData :cashCardIdGot="card.cashcardId" @dataReseaching="cashCardSearching" />
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
import { fetchCashCardList, fetchEnableCashCard, fetchDisableCashCard } from "@/server/cashCardApi";
import { IResponse, ICashCardList, IAccountSearchingParams } from "@/models/index";
import { currencyFormat, yearMonthDayTimeFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
});

const accountSearching = defineAsyncComponent(() => import("@/components/personalSettingComponents/accountSearching.vue"));
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

  try {
    const res: IResponse = await fetchCashCardList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      cashCardList.value = res.data.data;
      await cashCardListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function cashCardListFilterEvent() {
  cashCardListFiltered.value = cashCardList.value;
  if (searchWord.value.length > 0) {
    cashCardListFiltered.value = cashCardListFiltered.value.filter((row: ICashCardList) => {
      return row.cashcardName.toLowerCase().includes(searchWord.value.toLowerCase());
    });
  }

  tableData.value = sliceArray(cashCardListFiltered.value, currentPage.value, itemsPerPage.value);
}



async function adjustAbleStatus(card: ICashCardList) {

  try {
    const res: IResponse =
      await (card.enable === true ? fetchEnableCashCard : fetchDisableCashCard)(card.cashcardId);
    if (res.data.returnCode === 0) {
      showAxiosToast({ message: res.data.message });
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}
</script>
<style lang="scss" scoped></style>
