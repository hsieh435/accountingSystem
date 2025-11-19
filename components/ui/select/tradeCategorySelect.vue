<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="tradeCategoryId">
    <option v-for="category in tradeCategoryListFiltered" :key="category.value" :value="category.value">
      {{ category.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ISelectData, ITradeCategory, IResponse } from "@/models/index";
import { fetchTradeCategoryList } from "@/server/parameterApi";
import { messageToast } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

const props = withDefaults(defineProps<{ accountType?: string; tradeCategoryGot?: string; sellectAll?: boolean }>(), {
  accountType: "",
  tradeCategoryGot: "",
  sellectAll: true,
});
const emits = defineEmits(["sendbackTradeCategory"]);

const tradeCategoryId = ref<string>("");
const tradeCategoryList = ref<ITradeCategory[]>([]);
const tradeCategoryListFiltered = ref<ISelectData[]>([]);

onMounted(async () => {
  // console.log("onMounted props:", props);
  tradeCategoryId.value = props.tradeCategoryGot || "";
  await searchingTradeType();
});

watch(props, async () => {
  // console.log("watch props:", props);
  tradeCategoryId.value = props.tradeCategoryGot || "";
  await tradeCategoryListHandling();
});

watch(tradeCategoryId, () => {
  emits("sendbackTradeCategory", tradeCategoryId.value);
});

async function searchingTradeType() {
  try {
    const res: IResponse = await fetchTradeCategoryList();
    // console.log("fetchTradeCategoryList:", res.data.data);
    tradeCategoryList.value = res.data.data;
    await tradeCategoryListHandling();
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function tradeCategoryListHandling() {
  tradeCategoryListFiltered.value = tradeCategoryList.value
    .filter((item: ITradeCategory) => {
      return props.accountType ? item[props.accountType as keyof ITradeCategory] === true : true;
    })
    .map((item: ITradeCategory) => ({
      label: item.tradeName,
      value: item.tradeCode,
    }));
  if (props.sellectAll) {
    tradeCategoryListFiltered.value.unshift({ label: "所有項目", value: "" });
  }
  if (props.accountType === "") {
    tradeCategoryListFiltered.value.unshift({ label: "無", value: "" });
  }
}
</script>
<style lang="scss" scoped></style>
