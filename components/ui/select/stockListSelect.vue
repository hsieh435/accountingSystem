<template>
  <UInputMenu
    v-model="stockSelected"
    value-key="value"
    :items="filteredStockList"
    @input="onSearch"
    placeholder="搜尋 股票代碼或名稱"
    :loading="loading"
    loading-icon="i-lucide-loader"
    :disabled="props.isDisable" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchStockList } from "@/server/outerApi.ts";
import { IStockList, IResponse } from "@/models/index.ts";
import { debounceFn } from "@/composables/tools.ts";
import { messageToast } from "@/composables/swalDialog.ts";

const props = withDefaults(defineProps<{ stockNoGot?: string; isDisable?: boolean }>(), {
  stockNoGot: "",
  isDisable: false,
});
const emits = defineEmits(["sendbackStockNo"]);

const stockSelected = ref<string>("");
const rawStockList = ref<IStockList[]>([]);
const filteredStockList = ref<{ label: string; value: string }[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
  // console.log("onMounted props:", props);
  if (props.stockNoGot) {
    debounceSearchStocks(props.stockNoGot);
  }
});

watch(props, () => {
  // console.log("watch props:", props);
  if (props.stockNoGot) {
    debounceSearchStocks(props.stockNoGot);
  }
});

watch(stockSelected, () => {
  const selectedItem = rawStockList.value.find((item) => item.stockId === stockSelected.value);
  // console.log("stockSelected:", stockSelected.value);
  // console.log("selectedItem:", selectedItem);

  if (stockSelected.value && selectedItem) {
    // console.log("selectedItem:", selectedItem);
    // console.log("compair:", stockSelected.value === selectedItem.stockId);
    emits("sendbackStockNo", selectedItem);
  } else {
    return;
  }
});

function onSearch(event: Event) {
  debounceSearchStocks((event.target as HTMLInputElement).value);
}

const debounceSearchStocks = debounceFn(async (keyword: string) => {
  if (!keyword || keyword.trim().length < 1) {
    filteredStockList.value = [];
    stockSelected.value = "";
  } else {
    loading.value = true;
    try {
      const res: IResponse = await fetchStockList(keyword.trim());
      console.log("fetchStockList:", res.data.data);
      rawStockList.value = res.data.data;
      filteredStockList.value = res.data.data.map((item: IStockList) => ({
        value: item.stockId,
        label: `${item.stockName}（${item.stockId}）`,
      }));
      stockSelected.value = props.stockNoGot || "";
      // console.log("filteredStockList:", filteredStockList.value);
    } catch (error) {
      messageToast({ message: (error as Error).message, icon: "error" });
    } finally {
      loading.value = false;
    }
  }
});
</script>
<style lang="scss" scoped></style>
