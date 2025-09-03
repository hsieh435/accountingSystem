<template>
  <URadioGroup orientation="horizontal" color="neutral" variant="list" :items="items" v-model="transactionTypeValue" :disabled="isDisabled" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { RadioGroupItem, RadioGroupValue } from "@nuxt/ui"



const props = withDefaults(defineProps<{ transactionType?: string; isDisabled?: boolean }>(), { transactionType: "", isDisabled: false });
const emits = defineEmits(["sendbackTransactionType"]);



const items = ref<RadioGroupItem[]>([
  { label: "收入", value: "income" },
  { label: "支出", value: "expense" },
]);



const transactionTypeValue = ref<RadioGroupValue>("");



onMounted(() => {
  transactionTypeValue.value = props.transactionType || "";
});

watch(props, () => {
  transactionTypeValue.value = props.transactionType || "";
}, { immediate: true });

watch(transactionTypeValue, () => {
  // console.log("Selected value:", transactionTypeValue.value);
  emits("sendbackTransactionType", transactionTypeValue.value);
}, { immediate: true });



</script>
<style lang="scss" scoped></style>
