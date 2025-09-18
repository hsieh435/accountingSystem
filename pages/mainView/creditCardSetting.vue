<template>
  <div class="flex-col justify-start items-center">
    <div>
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <div class="my-1"></div>
      <creditCardData @dataReseaching="creditCardSearching" />
    </div>

    <div class="px-3">
      <template v-if="creditCardList.length > 0">
        <ui-pagination
          :totalDataQuanity="creditCardList.length"
          :searchingPlaceholder="'搜尋信用卡名稱'"
          @tableSliceChange="settingTableSlice" />
        <template v-if="creditCardListFiltered.length > 0">
          <div :class="tailwindStyles.tailwindTableStyles.tableClasses">
            <div :class="tailwindStyles.tailwindTableStyles.theadClasses">
              <div :class="tailwindStyles.tailwindTableStyles.theadtrClasses">
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">啟用</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">NO.</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">信用卡名稱</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">發卡銀行代號 / 名稱</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">發卡機構</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">結算貨幣</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">每月額度</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">消費提醒</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">到期</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">建立時間</div>
                <div :class="tailwindStyles.tailwindTableStyles.thClasses">操作</div>
              </div>
            </div>
            <div :class="tailwindStyles.tailwindTableStyles.tbodyClasses">
              <div :class="tailwindStyles.tailwindTableStyles.tbodytrClasses" v-for="card in tableData" :key="card.creditcardId">
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
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.creditcardName }}</div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                  {{ card.creditcardBankCode }} / {{ card.creditcardBankName }}
                </div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.creditcardSchema }}</div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.currencyName }}</div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ currencyFormat(card.creditPerMonth) }}</div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                  <font-awesome-icon class="mx-1" :icon="['fas', 'check']" v-if="card.openAlert" />
                </div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ card.expirationDate.slice(0, 7) }}</div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">{{ yearMonthDayTimeFormat(card.createdDate) }}</div>
                <div :class="tailwindStyles.tailwindTableStyles.tdClasses">
                  <creditCardData :creditCardIdGot="card.creditcardId" @dataReseaching="creditCardSearching" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="creditCardList.length === 0">
        <span :class="tailwindStyles.tailwindTableStyles.noDataClasses">無信用卡資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCreditCardList, fetchEnableCreditCard, fetchDisableCreditCard } from "@/server/creditCardApi";
import { IResponse, ICreditCardList, IAccountSearchingParams } from "@/models/index";
import { currencyFormat, yearMonthDayTimeFormat, sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "信用卡資料設定",
});

const accountSearching = defineAsyncComponent(
  () => import("@/components/personalSettingComponents/accountSearching.vue"),
);
const creditCardData = defineAsyncComponent(() => import("@/components/personalSettingComponents/creditCardData.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const searchWord = ref<string>("");

const searchingParams = reactive<IAccountSearchingParams>({
  currencyId: "",
});
const creditCardList = ref<ICreditCardList[]>([]);
const creditCardListFiltered = ref<ICreditCardList[]>([]);
const tableData = ref<ICreditCardList[]>([]);

onMounted(() => {
  creditCardSearching();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number; keyWord: string }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  searchWord.value = sliceData.keyWord.trim();
  await creditCardListFilterEvent();
}

async function settingSearchingParams(params: IAccountSearchingParams) {
  searchingParams.currencyId = params.currencyId;
  await creditCardSearching();
}

async function creditCardSearching() {
  try {
    const res: IResponse = await fetchCreditCardList(searchingParams);
    console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      creditCardList.value = res.data.data;
      await creditCardListFilterEvent();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function creditCardListFilterEvent() {
  creditCardListFiltered.value = creditCardList.value;
  if (searchWord.value.length > 0) {
    creditCardListFiltered.value = creditCardListFiltered.value.filter((row: ICreditCardList) => {
      return (
        row.creditcardName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.creditcardBankName.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.creditcardBankCode.toLowerCase().includes(searchWord.value.toLowerCase()) ||
        row.creditcardSchema.toLowerCase().includes(searchWord.value.toLowerCase())
      );
    });
  }
  tableData.value = sliceArray(creditCardListFiltered.value, currentPage.value, itemsPerPage.value);
}

async function adjustAbleStatus(card: ICreditCardList) {
  try {
    const res: IResponse = await (card.enable === true ? fetchEnableCreditCard : fetchDisableCreditCard)(
      card.creditcardId,
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
