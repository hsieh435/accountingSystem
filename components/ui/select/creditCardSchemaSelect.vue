<template>
  <select :class="tailwindStyles.selectClasses" v-model="schemaId" :disabled="props.isAble">
    <option v-for="schema in schemaArray" :key="schema.value" :value="schema.value">{{ schema.label }}</option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ISelectData, IResponse } from "@/models/index";
import { fetchCreditcardSchemaList } from "@/server/parameterApi";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import { tailwindStyles } from "@/assets/css/tailwindStyles";



const props = withDefaults(defineProps<{ selectId?: string; sellectAll?: boolean; isAble?: boolean }>(), { selectId: "", sellectAll: true, isAble: false });
const emits = defineEmits(["sendbackSchemaId"]);



const schemaId = ref<string>("");
const isSelectDisabled = ref<boolean>(true);
const schemaArray = ref<ISelectData[]>([]);



onMounted(async () => {
  if (props.selectId) {
    await searchingSchemaList();
    isSelectDisabled.value = false;
  }
});

watch(schemaId, () => {
  emits("sendbackSchemaId", schemaId.value);
});



async function searchingSchemaList() {
  schemaArray.value = [];

  try {
    const res = await fetchCreditcardSchemaList() as IResponse;
    console.log("res:", res);
    if (res.data.returnCode === 0) {
      schemaArray.value = res.data.data.map((item: any) => ({
        label: item.schemaName,
        value: item.schemaCode
      }));
      if (props.sellectAll) {
        schemaArray.value.unshift({ label: "所有發卡機構", value: "" });
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
