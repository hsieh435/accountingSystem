<template>
  <div class="w-full px-3">
    <div class="flex flex-wrap justify-start items-center">
      <accountSearching @sendbackSearchingParams="settingSearchingParams" />
      <creditCardData @dataReseaching="creditCardSearching" />
    </div>

    <template v-if="creditCardList.length > 0">
      <ui-pagination
        :totalDataQuanity="creditCardList.length"
        :searchingPlaceholder="'搜尋信用卡名稱'"
        @tableSliceChange="settingTableSlice" />
      <template v-if="creditCardListFiltered.length > 0">
        <div :class="tailwindStyles.tableClasses">
          <div :class="tailwindStyles.theadClasses">
            <div :class="tailwindStyles.theadtrClasses">
              <div :class="tailwindStyles.thClasses">啟用</div>
              <div :class="tailwindStyles.thClasses">NO.</div>
              <div :class="tailwindStyles.thClasses">信用卡名稱</div>
              <div :class="tailwindStyles.thClasses">發卡銀行代號 / 銀行名稱</div>
              <div :class="tailwindStyles.thClasses">發卡機構</div>
              <div :class="tailwindStyles.thClasses">結算貨幣</div>
              <div :class="tailwindStyles.thClasses">每月額度</div>
              <div :class="tailwindStyles.thClasses">到期</div>
              <div :class="tailwindStyles.thClasses">操作</div>
            </div>
          </div>
          <div :class="tailwindStyles.tbodyClasses">
            <div :class="tailwindStyles.tbodytrClasses" v-for="card in tableData" :key="card.creditcardId">
              <div :class="tailwindStyles.tdClasses">
                <ui-switch :switchValueGot="card.enable" @sendBackSwitchValue="(value: boolean) => { card.enable = value; adjustAbleStatus(card); }" />
              </div>
              <div :class="tailwindStyles.tdClasses">{{ card.no }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.creditcardName }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.creditcardBankCode }} {{ card.creditcardBankName }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.creditcardSchema }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.currency }}</div>
              <div :class="tailwindStyles.tdClasses">{{ currencyFormat(card.creditPerMonth) }}</div>
              <div :class="tailwindStyles.tdClasses">{{ card.expirationDate.slice(0, 7) }}</div>
              <div :class="tailwindStyles.tdClasses">
                <creditCardData :creditCardIdGot="card.creditcardId" @dataReseaching="creditCardSearching" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
    <template v-else-if="creditCardList.length === 0">
      <span :class="tailwindStyles.noDataClasses">無信用卡資料</span>
    </template>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCreditCardList, fetchEnableCreditCard, fetchDisableCreditCard } from "@/server/creditCardApi";
import { IResponse, ICreditCardList, IAccountSearchingParams } from "@/models/index";
import { currencyFormat, sliceArray } from "@/composables/tools";
import { tailwindStyles } from "@/assets/css/tailwindStyles";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "個人設定",
  subTitle: "信用卡資料設定",
});

const accountSearching = defineAsyncComponent(() => import("@/components/personalSettingComponents/accountSearching.vue"));
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
    const res: IResponse =
      await (card.enable === true ? fetchEnableCreditCard : fetchDisableCreditCard)(card.creditcardId);
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
