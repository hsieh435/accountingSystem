<template>
  <USwitch v-model="switchValue" :label="props.switchLabel" :disabled="props.isDisable" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";



const props = withDefaults(defineProps<{ switchValueGot?: boolean; switchLabel?: string; isDisable?: boolean }>(), { switchValueGot: false, switchLabel: "", isDisable: false });
const emits = defineEmits(["sendBackSwitchValue"]);



const switchValue = ref<boolean>(props.switchValueGot);



onMounted(() => {
  switchValue.value = props.switchValueGot;
});

watch(switchValue, () => {
  emits("sendBackSwitchValue", switchValue.value);
});



</script>
<style lang="scss" scoped></style>
