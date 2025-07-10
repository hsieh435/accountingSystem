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
import { ITradeCategory } from "@/models/index";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ categoryCodeGot?: string; cashCardIdGot?: string }>(), { categoryCodeGot: "", cashCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);



const dataParams = reactive<ITradeCategory>({
  categoryCode: props.categoryCodeGot || "",
  categoryName: "",
  sort: 0,
});



async function searchingCategoryCode() {
  // categoryCodeDataHandling();
  
}


async function categoryCodeDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.categoryCodeGot ? "編輯交易代碼" : "新增交易代碼",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">交易代碼：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="categoryCode" value="${dataParams.categoryCode}" ${props.categoryCodeGot ? "disabled" : "" } />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">交易名稱：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="categoryName" value="${dataParams.categoryName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">排序：</span>
          <input class="col-span-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="sort" value="${dataParams.sort}" type="number" />
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
      console.log("result:", result);

    }
  });
};


</script>
<style lang="scss" scoped></style>
