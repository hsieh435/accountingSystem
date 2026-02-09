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
  debounceSearchStocks(props.stockNoGot);
  if (rawStockList.value.length > 0) {
    stockSelected.value = props.stockNoGot;
    const selectedItem = filteredStockList.value.find((item) => item.value === props.stockNoGot);
    stockSelected.value = selectedItem?.value || "";
  }
});

// watch(props, () => {
//   console.log("watch props:", props);

//   stockSelected.value = props.stockNoGot || "";
//   if (stockSelected.value) {
//     debounceSearchStocks(stockSelected.value);
//   }
// });

watch(stockSelected, () => {
  // console.log("stockSelected:", stockSelected.value);

  if (stockSelected.value) {
    const selectedItem = rawStockList.value.find((item) => item.stockId === stockSelected.value);
    // console.log("selectedItem:", selectedItem);
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
