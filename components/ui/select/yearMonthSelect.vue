<template>
  <div style="width: 150px;">
    <VueDatePicker v-model="selectedYearMonth" month-picker text-input :min-date="minDate" :max-date="maxDate" format="yyyy/MM" locale="zh-TW" select-text="選取" :action-row="{ showCancel: false, }" :highlight="{ options: { highlightDisabled: true } }">
    </VueDatePicker>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import VueDatePicker from "@vuepic/vue-datepicker";


const props = withDefaults(defineProps<{ yearMonthGot?: string; hasRange?: boolean; maxYear?: number; maxMonth?: number; minYear?: number; minMonth?: number; }>(), { yearMonthGot: "", hasRange: false, maxYear: 0, maxMonth: 0, minYear: 0, minMonth: 0 });
const emits = defineEmits(["sendbackYearMonth"]);



const selectedYear = ref<number>(getCurrentYear());
const selectedMonth = ref<number>(getCurrentMonth());
const selectedYearMonth = ref<{ year: number; month: number }>({
  year: selectedYear.value,
  month: selectedMonth.value - 1,
});

const minDate = computed(() => {
  if (props.minYear && props.minMonth) {
    return new Date(props.minYear, props.minMonth - 1);
  }
});

const maxDate = computed(() => {
  if (props.maxYear && props.maxMonth) {
    return new Date(props.maxYear, props.maxMonth - 1);
  }
});

onMounted(() => {
  console.log("onMounted props:", props);
  if (props.yearMonthGot) {
    const date = new Date(props.yearMonthGot);
    selectedYear.value = date.getFullYear();
    selectedMonth.value = date.getMonth() + 1;
  }
  // settingRange();
  emits("sendbackYearMonth", selectedYear.value, selectedMonth.value);
});

watch(props, () => {
  console.log("watch props:", props);
  // settingRange();
});

watch(selectedYearMonth, () => {
  // console.log("watch selectedYearMonth:", selectedYearMonth.value.year, selectedYearMonth.value.month + 1);
  emits("sendbackYearMonth", selectedYearMonth.value.year, selectedYearMonth.value.month + 1);
});



// async function settingRange() {
//   console.log(props);
//   if (props.hasRange) {
//     console.log("maxDate:", maxDate);
//     console.log("minDate:", minDate);
//   }
// }



</script>
<style lang="scss" scoped></style>
