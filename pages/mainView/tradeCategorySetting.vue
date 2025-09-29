<template>
  <div class="flex-col justify-start items-center">
    <div class="flex flex-wrap justify-start items-center w-full px-3 py-1">
      <tradeCategoryData @dataReseaching="searchingTradeCategoryList" />
    </div>

    <div class="px-3">
      <template v-if="tradeCategoryList.length > 0">
        <ui-pagination
          :currentPage="1"
          :dataPerpage="tradeCategoryList.length"
          :pageArrayGot="[tradeCategoryList.length]"
          :totalDataQuanity="tradeCategoryList.length"
          :showFilter="false" />
        <template v-if="tradeCategoryListFiltered.length > 0">
          <div class="rounded-lg overflow-hidden p-0">
            <div :class="tailwindStyles.getTableClasses()">
              <div :class="tailwindStyles.getTheadClasses()">
                <div :class="tailwindStyles.getTheadtrClasses()">
                  <div :class="tailwindStyles.getThClasses()">NO.</div>
                  <div :class="tailwindStyles.getThClasses()">交易代碼</div>
                  <div :class="tailwindStyles.getThClasses()">交易名稱</div>
                  <div :class="tailwindStyles.getThClasses()">現金流</div>
                  <div :class="tailwindStyles.getThClasses()">儲值票卡</div>
                  <div :class="tailwindStyles.getThClasses()">信用卡</div>
                  <div :class="tailwindStyles.getThClasses()">存款帳戶</div>
                  <div :class="tailwindStyles.getThClasses()">證券帳戶</div>
                  <div :class="tailwindStyles.getThClasses()">操作</div>
                </div>
              </div>
              <div :class="tailwindStyles.getTbodyClasses()">
                <div :class="tailwindStyles.getTbodytrClasses()" v-for="trade in tableData" :key="trade.tradeCode">
                  <div :class="tailwindStyles.getTdClasses()">{{ trade.no }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ trade.tradeCode }}</div>
                  <div :class="tailwindStyles.getTdClasses()">{{ trade.tradeName }}</div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="trade.isCashflowAble" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="trade.isStoredvaluecardAble" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="trade.isCreditcardAble" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="trade.isCuaccountAble" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <font-awesome-icon icon="check" v-if="trade.isStaccountAble" />
                  </div>
                  <div :class="tailwindStyles.getTdClasses()">
                    <tradeCategoryData :tradeCodeGot="trade.tradeCode" @dataReseaching="searchingTradeCategoryList" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="tradeCategoryList.length === 0">
        <span :class="tailwindStyles.getNoDataClasses()">無交易代碼資料</span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { fetchTradeCategoryList } from "@/server/parameterApi";
import { ITradeCategory, IResponse } from "@/models/index";
import { sliceArray } from "@/composables/tools";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import { errorMessageDialog } from "@/composables/swalDialog";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "參數設定",
  subTitle: "支出類型設定",
});

const tradeCategoryData = defineAsyncComponent(
  () => import("@/components/parameterSettingComponents/tradeCategoryData.vue"),
);

const tradeCategoryList = ref<ITradeCategory[]>([]);
const tradeCategoryListFiltered = ref<ITradeCategory[]>([]);
const tableData = ref<ITradeCategory[]>([]);

onMounted(async () => {
  await searchingTradeCategoryList();
});

async function searchingTradeCategoryList() {
  try {
    const res: IResponse = await fetchTradeCategoryList();
    console.log("fetchTradeCategoryList:", res.data.data);
    if (res.data.returnCode === 0) {
      tradeCategoryList.value = res.data.data;
      await tradeCategoryListFilterEvent();
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

async function tradeCategoryListFilterEvent() {
  tradeCategoryListFiltered.value = tradeCategoryList.value;
  tableData.value = sliceArray(tradeCategoryListFiltered.value);
}
</script>
<style lang="scss" scoped></style>
