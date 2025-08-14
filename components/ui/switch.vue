<template>
  <!-- <USwitch v-model="switchValue" :label="props.switchLabel" :disabled="props.isDisable" /> -->
  <div class="flex justify-center items-center">
    <input class="relative w-10 h-5 transition-all duration-200 ease-in-out bg-gray-400 rounded-full shadow-inner outline-none appearance-none" v-model="switchValue" type="checkbox" :disabled="props.isDisable" />
 </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";



const props = withDefaults(defineProps<{ switchValueGot?: boolean; switchLabel?: string; isDisable?: boolean }>(), {
  switchValueGot: false,
  switchLabel: "",
  isDisable: false,
});
const emits = defineEmits(["sendBackSwitchValue"]);



const switchValue = ref<boolean>(props.switchValueGot);



onMounted(() => {
  switchValue.value = props.switchValueGot;
});

watch(switchValue, () => {
  emits("sendBackSwitchValue", switchValue.value);
});
</script>
<style lang="scss" scoped>
input:before {
  content: "";
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  top: 0;
  left: 0;
  transform: scale(1.1);
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.2);
  background-color: rgb(255, 255, 255);
  transition: 0.2s ease-in-out;
}

input:checked {
  background-color: rgb(127, 156, 245);
}

input:checked:before {
  left: 1.25rem;
}

// input:disabled {
//   background-color: rgb(122, 122, 122);
//   opacity: 0.7;
// }
</style>
