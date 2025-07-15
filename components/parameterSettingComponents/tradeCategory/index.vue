<template>  
  <template v-if="props.categoryCodeGot">
    <ui-buttonGroup showView :viewText="'檢視交易代碼'" @dataView="searchingCategoryCode()" />
  </template>
  <template v-if="!props.categoryCodeGot">
    <ui-buttonGroup showCreate :createText="'新增交易代碼'" @dataCreate="categoryCodeDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { fetchTradeCategory, fetchCreateTradeCategory, fetchUpdateTradeCategory } from "@/server/apiService";
import { ITradeCategory } from "@/models/index";
import { showAxiosErrorMsg } from "@/composables/swalDialog";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ categoryCodeGot?: string; cashCardIdGot?: string }>(), { categoryCodeGot: "", cashCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ITradeCategory>({
  categoryCode: props.categoryCodeGot || "",
  categoryName: "",
  isCashflowAble: false,
  isCashcardAble: false,
  isCreditcardAble: false,
  isCuaccountAble: false,
  isStaccountAble: false,
  sort: 0,
});



async function searchingCategoryCode() {
  // console.log("props:", props.categoryCodeGot);

  try {
    const res = await fetchTradeCategory(props.categoryCodeGot);
    // console.log("res:", res);
    dataParams.categoryCode = res.data.categoryCode;
    dataParams.categoryName = res.data.categoryName;
    dataParams.isCashflowAble = res.data.isCashflowAble;
    dataParams.isCashcardAble = res.data.isCashcardAble;
    dataParams.isCreditcardAble = res.data.isCreditcardAble;
    dataParams.isCuaccountAble = res.data.isCuaccountAble;
    dataParams.isStaccountAble = res.data.isStaccountAble;
    dataParams.sort = res.data.sort;

    await categoryCodeDataHandling();
  } catch (error) {
    // showAxiosErrorMsg({ message: (error as Error).message });
  }  
}


async function categoryCodeDataHandling(apiMsg?: string) {
  console.log(dataParams);

  Swal.fire({
    title: props.categoryCodeGot ? "編輯交易代碼" : "新增交易代碼",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易代碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="categoryCode" value="${dataParams.categoryCode}" ${props.categoryCodeGot ? "disabled" : "" } />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>交易名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="categoryName" value="${dataParams.categoryName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>排序：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="sort" value="${dataParams.sort}" type="number" />
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
    confirmButtonText: props.cashCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    confirmButtonColor: "#007fff",
    cancelButtonColor: "#ff4337",
    color: "#000",
    background: "#fff",
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

      dataParams.categoryCode = (document.getElementById("categoryCode") as HTMLInputElement).value;
      dataParams.categoryName = (document.getElementById("categoryName") as HTMLInputElement).value;
      dataParams.sort = Number((document.getElementById("sort") as HTMLInputElement).value);


      if (!dataParams.categoryCode) {
        errors.push("請填寫交易代碼");
      }
      if (!dataParams.categoryName) {
        errors.push("請填寫交易名稱");
      }
      if (isNaN(dataParams.sort) || dataParams.sort < 1 || dataParams.sort % 1 !== 0) {
        errors.push("排序需為正整數");
      }

      if (errors.length > 0) {
        Swal.showValidationMessage(errors.map((error, index) => `${index + 1}. ${error}`).join("<br>"));
        return false;
      }

      return { dataParams };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log("result:", result.value.dataParams);
      try {
        const res = await (props.categoryCodeGot ? fetchUpdateTradeCategory : fetchCreateTradeCategory)(result.value.dataParams);
        await categoryCodeDataHandling();
      } catch (error) {
        // showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
};


</script>
<style lang="scss" scoped></style>
