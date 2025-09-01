<template>
  <select :class="tailwindStyles.selectClasses" v-model="tradeCategoryId">
    <option v-for="category in tradeCategoryList" :key="category.value" :value="category.value">{{ category.label }}</option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ISelectData, ITradeCategory, IResponse } from "@/models/index";
import { fetchTradeCategoryList } from "@/server/parameterApi";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ accountType?: string; tradeCategoryGot?: string; sellectAll?: boolean; }>(), { accountType: "", tradeCategoryGot: "", sellectAll: true });
const emits = defineEmits(["sendbackTradeCategory"]);



const tradeCategoryId = ref<string>("");
const tradeCategoryList = ref<ISelectData[]>([]);



onMounted(async () => {
  // console.log("onMounted props:", props);
  tradeCategoryId.value = props.tradeCategoryGot || "";
  await searchingTradeType();
});

watch(tradeCategoryId, () => {
  emits("sendbackTradeCategory", tradeCategoryId.value);
});



async function searchingTradeType() {

  try {
    const res: IResponse = await fetchTradeCategoryList();
    // console.log("fetchTradeCategoryList:", res.data.data);
    if (res.data.returnCode === 0) {
      tradeCategoryList.value = res.data.data.filter((item: ITradeCategory) => {
        return props.accountType ? (item[props.accountType as keyof ITradeCategory] === true) : true;
      })
      .map((item: ITradeCategory) => ({
        label: item.tradeName,
        value: item.tradeCode
      }));
      if (props.sellectAll) {
        tradeCategoryList.value.unshift({ label: "所有項目", value: "" });
      }
    } else {
      showAxiosErrorMsg({ message: res.data.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
};
</script>
<style lang="scss" scoped></style>
