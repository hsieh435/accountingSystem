<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="stockNo">
    <option value="" v-if="props.sellectAll && stockList.length > 0">請選擇股票</option>
    <option value="" v-if="props.sellectAll && stockList.length === 0">（無股票）</option>
    <option v-for="stock in stockList" :key="stock.value" :value="stock.value">
      {{ stock.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchStockStorageList } from "@/server/stockStorageProfitApi.ts";
import { IStockStorageList, IStockList, IResponse } from "@/models/index.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";

const props = withDefaults(defineProps<{ isAllStorage?: boolean; accountIdGot?: string; stockNoGot?: string; sellectAll?: boolean }>(), {
  isAllStorage: false,
  accountIdGot: "",
  stockNoGot: "",
  sellectAll: true,
});

const emits = defineEmits(["sendbackStockNo"]);

const accountId = ref<string>("");
const stockNo = ref<string>("");
const rawStockList = ref<IStockList[]>([]);
const stockList = ref<{ label: string; value: string }[]>([]);

onMounted(async () => {
  accountId.value = props.accountIdGot;
  stockNo.value = props.stockNoGot;
  if (props.isAllStorage === true || (props.isAllStorage === false && accountId.value !== "")) {
    await searchingStockStorageList();
  } else {
    stockList.value = [];
    stockNo.value = "";
  }
});

watch(props, () => {
  // console.log("watch props:", props);
  accountId.value = props.accountIdGot;
  stockNo.value = props.stockNoGot;
  if (props.isAllStorage === true || (props.isAllStorage === false && accountId.value !== "")) {
    searchingStockStorageList();
  } else {
    stockList.value = [];
    stockNo.value = "";
  }
});

watch(stockNo, () => {
  const selectedItem = rawStockList.value.find((item) => item.stockNo === stockNo.value);
  console.log("rawStockList:", rawStockList.value);
  console.log("watch stockNo:", stockNo.value);
  console.log("selectedItem:", selectedItem);
  if (stockNo.value && selectedItem) {
    selectedItem["stockId"] = selectedItem.stockNo;
    // console.log("selectedItem:", selectedItem);
    emits("sendbackStockNo", selectedItem);
  } else {
    return;
  }
});

async function searchingStockStorageList() {
  try {
    const res: IResponse = await fetchStockStorageList({ stockAccountId: accountId.value });
    console.log("res:", res.data.data);
    rawStockList.value = res.data.data;
    stockList.value = res.data.data.map((item: IStockStorageList) => ({
      label: `${item.stockName}（${item.stockNo}）`,
      value: item.stockNo,
    }));
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
