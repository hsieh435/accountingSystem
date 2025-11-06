<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="stockNo">
    <option v-for="account in stockList" :key="account.value" :value="account.value">
      {{ account.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { fetchStockStorageList } from "@/server/storageProfitApi.ts";
import { IStockstockList, IStockStorageList, IResponse } from "@/models/index";
import { errorMessageDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

const props = withDefaults(defineProps<{ isAllStorage?: boolean; accountIdGot?: string; sellectAll?: boolean }>(), {
  isAllStorage: false,
  accountIdGot: "",
  sellectAll: true,
});

const emits = defineEmits(["sendbackStockNo"]);

const accountId = ref<string>("");
const stockNo = ref<string>("");
const stockList = ref<{ label: string; value: string }[]>([]);

onMounted(async () => {
  accountId.value = props.accountIdGot;
  if (props.isAllStorage === true || (props.isAllStorage === false && accountId.value !== "")) {
    await searchingStockStorageList();
  }
});

watch(props, () => {
  console.log("watch props:", props);
  accountId.value = props.accountIdGot;
  if (props.isAllStorage === true || (props.isAllStorage === false && accountId.value !== "")) {
    searchingStockStorageList();
  }
});

watch(stockNo, () => {
  // console.log("watch props:", stockNo.value);
  emits("sendbackStockNo", stockNo.value);
});

async function searchingStockStorageList() {

  try {
    const res: IResponse = await fetchStockStorageList({ stockAccountId: accountId.value });
    // console.log("res:", res.data.data);
    if (res.data.returnCode === 0) {
      stockList.value = res.data.data.map((item: IStockStorageList) => ({
        label: `${item.stockNo} / ${item.stockName}`,
        value: item.stockNo,
      }));
    } else {
      errorMessageDialog({ message: res.data.message });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message });
  }
}

//
</script>
<style lang="scss" scoped></style>
