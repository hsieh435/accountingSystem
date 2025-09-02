<template>
  <UInputMenu
    v-model="stockSelected"
    value-key="value"
    :items="filteredStockList"
    @input="onSearch"
    placeholder="搜尋 股票代碼或名稱"
    :loading="loading"
    loading-icon="i-lucide-loader"
    :disabled="props.isDisable"
    :popper="{ teleport: 'body', zIndex: 6000, popperClass: 'high-z-index-dropdown' }" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchStockList } from "@/server/outerWebApi";
import { IStockList, IResponse } from "@/models/index";
import { debounceFn } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";

const props = withDefaults(defineProps<{ stockNoGot?: string; isDisable?: boolean }>(), { stockNoGot: "", isDisable: false });
const emits = defineEmits(["sendbackStockNo"]);

const stockSelected = ref<string>("");
const rawStockList = ref<IStockList[]>([]);
const filteredStockList = ref<{ label: string; value: string }[]>([]);
const loading = ref<boolean>(false);

// onMounted(() => {
//   console.log("onMounted props:", props);
//   stockSelected.value = props.stockNoGot || "";
//   filteredStockList.value = [
//     { label: "台積電（2330）", value: "2330" },
//     { label: "鴻海（2317）", value: "2317" }
//   ];
// });

// watch(() => props, () => {
//   console.log("onMounted props:", props);
//   stockSelected.value = props.stockNoGot || "";
// });

watch(stockSelected, () => {
  console.log("stockSelected:", stockSelected.value);
  if (stockSelected.value) {
    const selectedItem = rawStockList.value.find((item) => item.stock_id === stockSelected.value);
    console.log("selectedItem:", selectedItem);
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
      // console.log("fetchStockList:", JSON.parse(res.data.data));
      if (res.data.returnCode === 0) {
        rawStockList.value = JSON.parse(res.data.data);
        filteredStockList.value = rawStockList.value.map((item: IStockList) => ({
          value: item.stock_id,
          label: `${item.stock_name}（${item.stock_id}）`,
        }));
        console.log("fetchStockList:", filteredStockList.value);
      } else {
        showAxiosErrorMsg({ message: res.data.message });
      }
    } catch (error) {
      showAxiosErrorMsg({ message: (error as Error).message });
    } finally {
      loading.value = false;
    }
  }
});
</script>
<style lang="scss" scoped>

/* 將 UInputMenu 的選單 z-index 提高，避免被 Swal2 遮蓋 */
.high-z-index-dropdown {
  z-index: 6000 !important;
}


</style>
