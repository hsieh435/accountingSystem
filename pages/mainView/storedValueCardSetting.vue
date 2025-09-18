<template>
  <div class="flex-col justify-start items-center">
    <accountSearching @sendbackSearchingParams="settingSearchingParams" />
    <div class="my-1"></div>
    <storedValueCardData @dataReseaching="storedValueCardSearching" />
  </div>
  <div class="w-full px-3">
    <template v-if="storedValueCardList.length > 0">
      <ui-pagination
        :totalDataQuanity="storedValueCardList.length"
        :searchingPlaceholder="'搜尋儲值票名稱'"
        @tableSliceChange="settingTableSlice" />
      <template v-if="storedValueCardListFiltered.length > 0">
        <div :class="tailwindStyles.tailwindTableStyles.tableClasses">
          <div :class="tailwindStyles.tailwindTableStyles.theadClasses">
            <div :class="tailwindStyles.tailwindTableStyles.theadtrClasses">
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">啟用</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">票卡名稱</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">使用貨幣</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">初始金額</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">目前金額</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">最小儲值金額</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">最大儲值金額</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">提醒</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">建立時間</div>
              <div :class="tailwindStyles.tailwindTableStyles.thClasses">操作</div>
            </div>
          </div>
          <div :class="tailwindStyles.tailwindTableStyles.tbodyClasses">
            <div :class="tailwindStyles.tailwindTableStyles.tbodytrClasses" v-for="card in tableData" :key="card.storedValueCardId">
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                <ui-switch
                  :switchValueGot="card.enable"
                  @sendBackSwitchValue="
                    (value: boolean) => {
                      card.enable = value;
                      adjustAbleStatus(card);
                    }
                  " />
              </div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.no }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.storedValueCardName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.currencyName }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(card.startingAmount) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(card.presentAmount) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(card.minimumValueAllowed) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(card.maximumValueAllowed) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                <font-awesome-icon class="mx-1" :icon="['fas', 'check']" v-if="card.openAlert" />
              </div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ yearMonthDayTimeFormat(card.createdDate) }}</div>
              <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                <storedValueCardData :storedValueCardIdGot="card.storedValueCardId" @dataReseaching="storedValueCardSearching" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="storedValueCardList.length === 0">
      <span :class="tailwindStyles.tailwindTableStyles.noDataClasses">無儲值票卡資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import {
  fetchStoredValueCardList,
  fetchEnableStoredValueCard,
  fetchDisableStoredValueCard,
} from "@/server/storedValueCardApi";
import { IResponse, IStoredValueCardList, IAccountSearchingParams } from "@/models/index";
import { currencyFormat, yearMonthDayTimeFormat, sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "儲值票卡資料設定",
});

const accountSearching = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/accountSearching.vue"),
);
const storedValueCardData = defineAsyncComponent(() => import("@/components/personalSettingComponents/storedValueCardData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});
const storedValueCardList = ref<IStoredValueCardList[]>([]);
const storedValueCardListFiltered = ref<IStoredValueCardList[]>([]);
const tableData = ref<IStoredValueCardList[]>([]);

onMounted(() => {
  storedValueCardSearching();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await storedValueCardListFilterEvent();
}

async function settingSearchingParams(params: IAccountSearchingParams) {
  searchingParams.currencyId = params.currencyId;
  await storedValueCardSearching();
}

async function storedValueCardSearching() {
  try {
    const res: IResponse = await fetchStoredValueCardList(searchingParams);
    console.log("fetchStoredValueCardList:", res.data.data);
    if (res.data.returnCode === 0) {
      storedValueCardList.value = res.data.data;
      await storedValueCardListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function storedValueCardListFilterEvent() {
  storedValueCardListFiltered.value = storedValueCardList.value;
  if (searchWord.value.length > 0) {
    storedValueCardListFiltered.value = storedValueCardListFiltered.value.filter((row: IStoredValueCardList) => {
      return row.storedValueCardName.toLowerCase().includes(searchWord.value.toLowerCase());
    });
  }

  tableData.value = sliceArray(storedValueCardListFiltered.value, currentPage.value, itemsPerPage.value);
}

async function adjustAbleStatus(card: IStoredValueCardList) {
  try {
    const res: IResponse = await (card.enable === true ? fetchEnableStoredValueCard : fetchDisableStoredValueCard)(
      card.storedValueCardId,
    );
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
