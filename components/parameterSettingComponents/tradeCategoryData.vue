<template>
  <template v-if="props.tradeCodeGot">
    <ui-buttonGroup showView :viewText="'檢視交易代碼'" @dataView="searchingTradeCategory()" />
    <ui-buttonGroup showRemove :createText="'刪除交易代碼'" @dataRemove="removeTradeCategory()" />
  </template>
  <template v-if="!props.tradeCodeGot">
    <ui-buttonGroup showCreate :createText="'新增交易代碼'" @dataCreate="tradeCategoryDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import {
  fetchTradeCategory,
  fetchCreateTradeCategory,
  fetchUpdateTradeCategory,
  fetchDeleteTradeCategory,
} from "@/server/parameterApi";
import { ITradeCategory, IResponse } from "@/models/index";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ tradeCodeGot?: string }>(), { tradeCodeGot: "" });
const emits = defineEmits(["dataReseaching"]);

const dataParams = reactive<ITradeCategory>({
  tradeCode: props.tradeCodeGot || "",
  tradeName: "",
  isCashflowAble: false,
  isCashcardAble: false,
  isCreditcardAble: false,
  isCuaccountAble: false,
  isStaccountAble: false,
  sort: 0,
});

async function searchingTradeCategory() {
  // console.log("props:", props.tradeCodeGot);

  try {
    const res: IResponse = await fetchTradeCategory(props.tradeCodeGot);
    // console.log("res:", res);
    if (res.data.returnCode === 0) {
      dataParams.tradeCode = res.data.data.tradeCode;
      dataParams.tradeName = res.data.data.tradeName;
      dataParams.isCashflowAble = res.data.data.isCashflowAble;
      dataParams.isCashcardAble = res.data.data.isCashcardAble;
      dataParams.isCreditcardAble = res.data.data.isCreditcardAble;
      dataParams.isCuaccountAble = res.data.data.isCuaccountAble;
      dataParams.isStaccountAble = res.data.data.isStaccountAble;
      dataParams.sort = res.data.data.sort;
      await tradeCategoryDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function tradeCategoryDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.tradeCodeGot ? "編輯交易代碼" : "新增交易代碼",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易代碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeCode" value="${dataParams.tradeCode}" ${props.tradeCodeGot ? "disabled" : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="tradeName" value="${dataParams.tradeName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>排序：</span>
          <input class="${tailwindStyles.inputClasses}" id="sort" value="${dataParams.sort}" type="number" />
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">適用：</span>
          <div class="flex flex-wrap justify-start items-center col-span-4">
            <div class="me-2">
              <input class="border border-gray-300 mx-1" id="isCashflowAble" value="${dataParams.isCashflowAble}" type="checkbox" />
              <label for="isCashflowAble">現金</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" id="isCashcardAble" value="${dataParams.isCashcardAble}" type="checkbox" />
              <label for="isCashcardAble">儲值票卡</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" id="isCreditcardAble" value="${dataParams.isCreditcardAble}" type="checkbox" />
              <label for="isCreditcardAble">信用卡</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" id="isCuaccountAble" value="${dataParams.isCuaccountAble}" type="checkbox" />
              <label for="isCuaccountAble">存款帳戶</label>
            </div>
            <div class="me-2">
              <input class="border border-gray-300 mx-1" id="isStaccountAble" value="${dataParams.isStaccountAble}" type="checkbox" />
              <label for="isStaccountAble">證券帳戶</label>
            </div>
          </div>
        </div>

      </div>
    `,
    confirmButtonText: props.tradeCodeGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      const isCashflowAbleCheckbox = document.getElementById("isCashflowAble") as HTMLInputElement;
      isCashflowAbleCheckbox.checked = dataParams.isCashflowAble;

      const isCashcardAbleAbleCheckbox = document.getElementById("isCashcardAble") as HTMLInputElement;
      isCashcardAbleAbleCheckbox.checked = dataParams.isCashcardAble;

      const isCreditcardAbleCheckbox = document.getElementById("isCreditcardAble") as HTMLInputElement;
      isCreditcardAbleCheckbox.checked = dataParams.isCreditcardAble;

      const isCuaccountAbleCheckbox = document.getElementById("isCuaccountAble") as HTMLInputElement;
      isCuaccountAbleCheckbox.checked = dataParams.isCuaccountAble;

      const isStaccountAbleCheckbox = document.getElementById("isStaccountAble") as HTMLInputElement;
      isStaccountAbleCheckbox.checked = dataParams.isStaccountAble;

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.tradeCode = (document.getElementById("tradeCode") as HTMLInputElement).value;
      dataParams.tradeName = (document.getElementById("tradeName") as HTMLInputElement).value;
      dataParams.isCashflowAble = (document.getElementById("isCashflowAble") as HTMLInputElement).checked;
      dataParams.isCashcardAble = (document.getElementById("isCashcardAble") as HTMLInputElement).checked;
      dataParams.isCreditcardAble = (document.getElementById("isCreditcardAble") as HTMLInputElement).checked;
      dataParams.isCuaccountAble = (document.getElementById("isCuaccountAble") as HTMLInputElement).checked;
      dataParams.isStaccountAble = (document.getElementById("isStaccountAble") as HTMLInputElement).checked;
      dataParams.sort = Number((document.getElementById("sort") as HTMLInputElement).value);

      if (!dataParams.tradeCode) {
        errors.push("請填寫交易代碼");
      }
      if (!dataParams.tradeName) {
        errors.push("請填寫交易名稱");
      }
      if (isNaN(dataParams.sort) || dataParams.sort < 1 || dataParams.sort % 1 !== 0) {
        errors.push("排序需為正整數");
      }
      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return dataParams;
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      // console.log("result:", result.value);
      try {
        const res: IResponse = await (props.tradeCodeGot ? fetchUpdateTradeCategory : fetchCreateTradeCategory)(
          result.value,
        );
        console.log("res:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
        } else {
          tradeCategoryDataHandling(res.data.message);
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
}

async function removeTradeCategory() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除該交易代碼",
    confirmButtonMsg: "確定刪除",
    executionApi: fetchDeleteTradeCategory,
    apiParams: props.tradeCodeGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
