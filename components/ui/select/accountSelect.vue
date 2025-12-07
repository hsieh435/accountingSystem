<template>
  <select :class="tailwindStyles.getSelectClasses()" v-model="accountId" :disabled="isDisabled">
    <option v-for="account in accountList" :key="account.value" :value="account.value">
      {{ account.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { fetchCashFlowList } from "@/server/cashFlowApi";
import { fetchStoredValueCardList } from "@/server/storedValueCardApi";
import { fetchCreditCardList } from "@/server/creditCardApi";
import { fetchCurrencyAccountList } from "@/server/currencyAccountApi";
import { fetchStockAccountList } from "@/server/stockAccountApi";
import { IAccountSearchingParams } from "@/models/index";
import { messageToast } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";

const props = withDefaults(
  defineProps<{
    selectTargetId?: string;
    accountIdGot?: string;
    sellectAll?: boolean;
    isDisable?: boolean;
  }>(),
  { selectTargetId: "", accountIdGot: "", sellectAll: true, isDisable: false },
);

const emits = defineEmits(["sendbackAccount"]);

const accountId = ref<string>("");
const accountList = ref<{ label: string; value: string }[]>([]);
const searchingParams = reactive<IAccountSearchingParams>({ currencyId: "" });
const oriAccountList = ref<any[]>([]);
const isDisabled = computed(() => props.isDisable);

onMounted(async () => {
  // console.log("accountId:", accountId.value);
  if (props.selectTargetId) {
    await loadAccountList();
  }
});

watch(accountId, () => {
  const selectedItem = oriAccountList.value.find((item) => item.pkValue === accountId.value);
  // console.log("accountId:", accountId.value);
  // console.log("selectedItem:", selectedItem);
  emits("sendbackAccount", selectedItem ? selectedItem : {});
});

// Account type configuration
const accountTypeConfig = {
  isCashflowAble: {
    fetch: fetchCashFlowList,
    pkField: "cashflowId",
    nameField: "cashflowName",
  },
  isStoredvaluecardAble: {
    fetch: fetchStoredValueCardList,
    pkField: "storedValueCardId",
    nameField: "storedValueCardName",
  },
  isCreditcardAble: {
    fetch: fetchCreditCardList,
    pkField: "creditcardId",
    nameField: "creditcardName",
  },
  isCuaccountAble: {
    fetch: fetchCurrencyAccountList,
    pkField: "accountId",
    nameField: "accountName",
  },
  isStaccountAble: {
    fetch: fetchStockAccountList,
    pkField: "accountId",
    nameField: "accountName",
  },
};

async function loadAccountList() {
  try {
    const list = await getAccountListByType(props.selectTargetId, searchingParams);
    accountList.value = props.sellectAll ? [{ label: "全部", value: "" }, ...list] : list;
    accountId.value = props.sellectAll ? props.accountIdGot || "" : accountList.value[0]?.value || "";
  } catch (error) {
    messageToast({ message: (error as Error).message, icon: "error" });
  }
}

async function getAccountListByType(type: string, params: IAccountSearchingParams) {
  const config = accountTypeConfig[type as keyof typeof accountTypeConfig];

  if (!config) {
    oriAccountList.value = [];
    return [];
  }

  const res = await config.fetch(params);

  if (!res.data.data.length) {
    oriAccountList.value = [];
    return [];
  }

  oriAccountList.value = res.data.data.map((item: any) => ({
    ...item,
    pkValue: item[config.pkField],
  }));

  return res.data.data.map((item: any) => ({
    label: item[config.nameField],
    value: item[config.pkField],
  }));
}
</script>
<style lang="scss" scoped></style>
