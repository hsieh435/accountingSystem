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
      :highlight="{ options: { highlightDisabled: true } }"
      :disabled="isDisabled" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { getCurrentTimestamp } from "@/composables/tools";
import VueDatePicker from "@vuepic/vue-datepicker";

const props = withDefaults(
  defineProps<{
    dateTimeGot?: string;
    hasRange?: boolean;
    minDateTime?: string;
    maxDateTime?: string;
    isDisabled?: boolean;
  }>(),
  { dateTimeGot: "", hasRange: false, minDateTime: "", maxDateTime: "", isDisabled: false },
);
const emits = defineEmits(["sendbackDateTime"]);

const dateTimeString = ref<number>(getCurrentTimestamp());

onMounted(async () => {
  // console.log("props:", props);
  dateTimeString.value = props.dateTimeGot ? new Date(props.dateTimeGot).getTime() : getCurrentTimestamp();
});

watch(dateTimeString, () => {
  if (dateTimeString.value) {
    const newDateTime = new Date(dateTimeString.value);
    emits("sendbackDateTime", newDateTime.toISOString());
  } else {
    emits("sendbackDateTime", "");
  }
});
</script>
<style lang="scss" scoped></style>
