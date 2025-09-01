<template>
  <div style="width: 250px">
    <VueDatePicker
      v-model="dateTimeString"
      time-picker-inline
      text-input
      auto-apply
      partial-flow
      year-first
      format="yyyy/MM/dd HH:mm"
      locale="zh-TW"
      week-start="0"
      :day-names="['日', '一', '二', '三', '四', '五', '六']"
      :highlight="{ options: { highlightDisabled: true } }" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentTimestamp } from "@/composables/tools";
import VueDatePicker from "@vuepic/vue-datepicker";

const props = withDefaults(
  defineProps<{ dateTimeGot?: string; hasRange?: boolean; minDateTime?: string; maxDateTime?: string }>(),
  { dateTimeGot: "", hasRange: false, minDateTime: "", maxDateTime: "" },
);
const emits = defineEmits(["sendbackDateTime"]);

const dateTimeString = ref<number>(getCurrentTimestamp());

onMounted(async () => {
  // console.log("props:", props);
  dateTimeString.value = props.dateTimeGot ? new Date(props.dateTimeGot).getTime() : getCurrentTimestamp();
});

watch(
  () => dateTimeString.value,
  () => {
    const newDateTime = new Date(dateTimeString.value);
    const newDateTimeString = `${newDateTime.getFullYear()}-${(newDateTime.getMonth() + 1).toString().padStart(2, "0")}-${newDateTime.getDate().toString().padStart(2, "0")} ${newDateTime.getHours().toString().padStart(2, "0")}:${newDateTime.getMinutes().toString().padStart(2, "0")}:00`;
    // console.log("newDateTime.toISOString():", newDateTime.toISOString());
    // console.log("new Date(newDateTimeString):", new Date(newDateTimeString));
    emits("sendbackDateTime", new Date(newDateTimeString));
  },
);
</script>
<style lang="scss" scoped></style>
