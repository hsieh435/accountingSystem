<template>
  <div style="width: 150px;">

    <VueDatePicker v-model="dateString" :min-date="props.minDate" :max-date="props.maxDate" text-input auto-apply partial-flow year-first format="yyyy/MM/dd" locale="zh-TW" week-start="0" :day-names="['日', '一', '二', '三', '四', '五', '六']" :enable-time-picker="false" :action-row="{ showNow: true }" now-button-label="今日" :highlight="{ options: { highlightDisabled: true } }">
    </VueDatePicker>
    <!-- :action-row="{ showNow: true }" now-button-label="今日" -->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentYMD } from "@/composables/tools"
import VueDatePicker from "@vuepic/vue-datepicker";




const props = withDefaults(defineProps<{ dateSelect?: string; minDate?: string; maxDate?: string; }>(), { dateSelect: "", minDate: "", maxDate: "" });
const emits = defineEmits(["sendbackDate"]);



const dateString = ref<string>("");



onMounted(async () => {
  // console.log("onMounted props:", props);
  dateString.value = props.dateSelect || getCurrentYMD();
});

watch(props, () => {
  // console.log("watch props:", props);
  dateString.value = props.dateSelect || getCurrentYMD();
});

watch(() => dateString.value, () => {
  // console.log("watch dateString:", dateString.value);
  const newDate = new Date(dateString.value);
  emits("sendbackDate", `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}` );
});



</script>
<style lang="scss" scoped></style>
