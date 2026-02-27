<template>
  <div class="flex-col justify-start items-center">
    <div class="w-full bg-gray-100 flex flex-wrap justify-start items-center gap-x-3 gap-y-1 px-3 py-1">
      <div class="flex items-center">
        <span>信用卡：</span>
        <accountSelect :selectTargetId="'isCreditcardAble'" :sellectAll="true" @sendbackAccount="settingAccountId" />
      </div>
      <ui-buttonGroup showSearch @dataSearch="searchingLimit()" />
    </div>

    <div class="my-1 px-3">
      <template v-if="creditCardLimit.length > 0">
        <ui-pagination
          :currentPage="currentPage"
          :dataPerpage="itemsPerPage"
          :totalDataQuanity="creditCardLimitFiltered.length"
          :showFilter="false"
          @tableSliceChange="settingTableSlice" />
        <template v-if="creditCardLimitFiltered.length > 0">
          <div class="rounded-lg overflow-auto">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">信用卡</div>
                  <div :class="tailwindStyles.getThClasses()">年 / 月</div>
                  <div :class="tailwindStyles.getThClasses()">額度</div>
                  <div :class="tailwindStyles.getThClasses()">調整</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div :class="tailwindStyles.getTbodytrClasses()" v-for="(creditCard, creditCardIndex) in tableData" :key="creditCardIndex">
                  <div :class="tailwindStyles.getTdClasses()">{{ creditCard.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ creditCard.creditcardName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    {{ getCurrentYear(creditCard.limitYearMonth) }} / {{ getCurrentMonth(creditCard.limitYearMonth) }}
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <UInputNumber v-model="creditCard.limitCredit" orientation="vertical" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <ui-buttonGroup showSave :saveText="'修改額度'" @dataSave="adjustCreditCardLimit(creditCard)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="creditCardLimit.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive, onMounted } from "vue";
import { fetchCreditCardLimit, fetchCreditCardLimitUpdate } from "@/server/creditCardApi.ts";
import { ICreditCardList, ICreditCardLimitList, IResponse } from "@/models/index.ts";
import { getCurrentYear, getCurrentMonth, sliceArray } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";


declare function definePageMeta(meta: { [key: string]: string }): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "信用卡額度設定",
});

const accountSelect = defineAsyncComponent(() => import("@/components/ui/select/accountSelect.vue"));

const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);

const searchCreditCard = reactive<{ creditcardId: string; yearMonth: string }>({
  creditcardId: "",
  yearMonth: ""
});
const creditCardLimit = ref<ICreditCardLimitList[]>([]);
const creditCardLimitFiltered = ref<ICreditCardLimitList[]>([]);
const tableData = ref<ICreditCardLimitList[]>([]);

onMounted(() => {
  searchingLimit();
});

async function settingTableSlice(sliceData: { currentPage: number; itemsPerPage: number }) {
  currentPage.value = sliceData.currentPage;
  itemsPerPage.value = sliceData.itemsPerPage;
  await creditCardLimitFilterEvent();
}

async function settingAccountId(creditCard: ICreditCardList | null) {
  searchCreditCard.creditcardId = creditCard?.creditcardId || "";
  // console.log("creditCard:", creditCard);
  // console.log("searchCreditCard:", searchCreditCard.value);
}

async function searchingLimit() {
  try {
    const res: IResponse = await fetchCreditCardLimit(searchCreditCard);
    console.log("fetchCreditCardLimit:", res.data.data);
    creditCardLimit.value = res.data.data;
    await creditCardLimitFilterEvent();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function creditCardLimitFilterEvent() {
  creditCardLimitFiltered.value = creditCardLimit.value;
  tableData.value = sliceArray(creditCardLimitFiltered.value, currentPage.value, itemsPerPage.value);
}



async function adjustCreditCardLimit(creditCard: ICreditCardLimitList) {
  console.log("creditCard:", creditCard);
  try {
    const res: IResponse = await fetchCreditCardLimitUpdate(creditCard);
    // console.log("fetchCreditCardLimitUpdate:", res.data.data);
    messageToast({ message: res.data.message, icon: "success" });
    await searchingLimit();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
