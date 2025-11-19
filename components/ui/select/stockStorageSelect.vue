<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="stockNo">
    <option value="" v-if="props.sellectAll">請選擇股票</option>
    <option v-for="account in stockList" :key="account.value" :value="account.value">
      {{ account.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { fetchStockStorageList } from "@/server/storageProfitApi.ts";
import { IStockStorageList, IResponse } from "@/models/index";
import { messageToast } from "@/composables/swalDialog";
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
  // console.log("watch props:", props);
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
    console.log("res:", res.data.data);
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
