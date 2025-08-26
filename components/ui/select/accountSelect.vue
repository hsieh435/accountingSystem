<template>
  <select :class="tailwindStyles.selectClasses" v-model="accountId" :disabled="isDisabled">
    <option v-for="account in accountList" :key="account.value" :value="account.value">
      {{ account.label }}
    </option>
  </select>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { fetchCashFlowList } from "@/server/cashFlowApi";
import { fetchCashCardList } from "@/server/cashCardApi";
import { fetchCreditCardList } from "@/server/creditCardApi";
import { fetchCurrencyAccountList } from "@/server/currencyAccountApi";
import { fetchStockAccountList } from "@/server/stockAccountApi";
import { IAccountSearchingParams } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import { tailwindStyles } from "@/assets/css/tailwindStyles";

const props = withDefaults(
  defineProps<{
    selectTargetId: string;
    selectTitle?: string;
    accountIdGot?: string;
    sellectAll?: boolean;
    isDisable?: boolean;
  }>(),
  { selectTargetId: "", selectTitle: "", accountIdGot: "", sellectAll: true, isDisable: false },
);

const emits = defineEmits(["sendbackAccountId"]);

const accountId = ref<string>("");
const accountList = ref<{ label: string; value: string }[]>([]);
const searchParams = reactive<IAccountSearchingParams>({ currencyId: "" });
const oriAccountList = ref<any[]>([]);

const isDisabled = computed(() => props.isDisable);

onMounted(async () => {
  // console.log("onMounted props:", props.accountIdGot);
  if (props.selectTargetId) {
    await loadAccountList();
    accountId.value = props.accountIdGot;
  }
});

watch(accountId, () => {
  const selectedItem = oriAccountList.value.find((item) => item.pkValue === accountId.value);
  emits("sendbackAccountId", accountId.value, selectedItem ? selectedItem.currency : "");
});

async function loadAccountList() {
  try {
    const list = await getAccountListByType(props.selectTargetId, searchParams);
    console.log("list:", list);
    accountList.value = props.sellectAll ? [{ label: "全部", value: "" }, ...list] : list;
    // console.log("list:", list);
    // console.log("accountList:", accountList.value);

  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function getAccountListByType(type: string, params: IAccountSearchingParams) {
  switch (type) {
    case "isCashflowAble": {
      const res = await fetchCashFlowList(params);
      oriAccountList.value = res.data.data;
      for (let i = 0; i < oriAccountList.value.length; i++) {
        oriAccountList.value[i]["pkValue"] = oriAccountList.value[i].cashflowId;
      }
      // console.log("res:", res.data.data);
      return res.data.data.map((item: any) => ({
        label: item.cashflowName,
        value: item.cashflowId,
      }));
    }
    case "isCashcardAble": {
      const res = await fetchCashCardList(params);
      oriAccountList.value = res.data.data;
      for (let i = 0; i < oriAccountList.value.length; i++) {
        oriAccountList.value[i]["pkValue"] = oriAccountList.value[i].cashcardId;
      }
      return res.data.data.map((item: any) => ({
        label: item.cashcardName,
        value: item.cashcardId,
      }));
    }
    case "isCreditcardAble": {
      const res = await fetchCreditCardList(params);
      oriAccountList.value = res.data.data;
      for (let i = 0; i < oriAccountList.value.length; i++) {
        oriAccountList.value[i]["pkValue"] = oriAccountList.value[i].creditcardId;
      }
      return res.data.data.map((item: any) => ({
        label: item.creditcardName,
        value: item.creditcardId,
      }));
    }
    case "isCuaccountAble": {
      const res = await fetchCurrencyAccountList(params);
      oriAccountList.value = res.data.data;
      for (let i = 0; i < oriAccountList.value.length; i++) {
        oriAccountList.value[i]["pkValue"] = oriAccountList.value[i].accountId;
      }
      return res.data.data.map((item: any) => ({
        label: item.accountName,
        value: item.accountName,
      }));
    }
    case "isStaccountAble": {
      const res = await fetchStockAccountList(params);
      oriAccountList.value = res.data.data;
      for (let i = 0; i < oriAccountList.value.length; i++) {
        oriAccountList.value[i]["pkValue"] = oriAccountList.value[i].accountId;
      }
      return res.data.data.map((item: any) => ({
        label: item.accountName,
        value: item.accountId,
      }));
    }
    default:
      oriAccountList.value = [];
      return [];
  }
}
</script>
<style lang="scss" scoped></style>
