<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="schemaId" :disabled="props.isAble">
    <option v-for="schema in schemaArray" :key="schema.value" :value="schema.value">{{ schema.label }}</option>
  </select>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ISelectData, IResponse } from "@/models/index.ts";
import { fetchCreditcardSchemaList } from "@/server/parameterApi.ts";
import { messageToast } from "@/composables/swalDialog.ts";
import * as tailwindStyles from "@/assets/css/tailwindStyles.ts";

const props = withDefaults(defineProps<{ selectId?: string; sellectAll?: boolean; isAble?: boolean }>(), {
  selectId: "",
  sellectAll: true,
  isAble: false,
});
const emits = defineEmits(["sendbackSchemaId"]);

const schemaId = ref<string>("");
const isSelectDisabled = ref<boolean>(true);
const schemaArray = ref<ISelectData[]>([]);

onMounted(async () => {
  // console.log("props:", props);
  await searchingSchemaList();
  if (props.selectId) {
    schemaId.value = props.selectId;
    isSelectDisabled.value = false;
  }
});

watch(schemaId, () => {
  emits("sendbackSchemaId", schemaId.value);
});

async function searchingSchemaList() {
  schemaArray.value = [];

  try {
    const res: IResponse = await fetchCreditcardSchemaList();
    // console.log("res:", res.data.data);
    schemaArray.value = res.data.data.map((item: { schemaName: string; schemaCode: string }) => ({
      label: item.schemaName,
      value: item.schemaCode,
    }));

    if (props.sellectAll) {
      schemaArray.value.unshift({ label: "所有發卡機構", value: "" });
    } else if (props.sellectAll === false && !props.selectId) {
      schemaId.value = schemaArray.value[0].value;
      emits("sendbackSchemaId", schemaId.value);
    }
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}
</script>
<style lang="scss" scoped></style>
