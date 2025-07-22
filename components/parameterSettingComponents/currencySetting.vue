<template>  
  <template v-if="props.currencyCodeGot">
    <ui-buttonGroup showView :viewText="'檢視貨幣資料'" @dataView="searchingCategoryCode()" />
  </template>
  <template v-if="!props.currencyCodeGot">
    <ui-buttonGroup showCreate :createText="'新增貨幣資料'" @dataCreate="categoryCodeDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { fetchEachCurrency, fetchCreateCurrency, fetchUpdateCurrency } from "@/server/currencyApi";
import { ICurrency, IResponse } from "@/models/index";
import { showAxiosToast, showAxiosErrorMsg } from "@/composables/swalDialog";
import tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";



const props = withDefaults(defineProps<{ currencyCodeGot?: string }>(), { currencyCodeGot: "", });
const emits = defineEmits(["dataReseaching"]);

  

const dataParams = reactive<ICurrency>({
  currencyCode: props.currencyCodeGot || "",
  currencyName: "",
  allowDelete: true,
  sort: 0,
});



async function searchingCategoryCode() {
  // console.log("props:", props.currencyCodeGot);

  try {
    const res = await fetchEachCurrency(props.currencyCodeGot) as IResponse;
    // console.log("res:", res);
    if (res.data.returnCode === 0) {
      dataParams.currencyCode = res.data.data.currencyCode;
      dataParams.currencyName = res.data.data.currencyName;
      dataParams.sort = res.data.data.sort;
      await categoryCodeDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }  
}



async function categoryCodeDataHandling(apiMsg?: string) {
  console.log(dataParams);

  Swal.fire({
    title: props.currencyCodeGot ? "編輯貨幣資料" : "新增貨幣資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span class="my-3"><span class="text-red-600 mx-1">※</span>皆為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">貨幣代碼：</span>
          <input class="${tailwindStyles.inputClasses}" id="currencyCode" value="${dataParams.currencyCode}" ${props.currencyCodeGot ? "disabled" : "" } />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">貨幣名稱：</span>
          <input class="${tailwindStyles.inputClasses}" id="currencyName" value="${dataParams.currencyName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">排序：</span>
          <input class="${tailwindStyles.inputClasses}" id="sort" value="${dataParams.sort}" type="number" />
        </div>

      </div>
    `,
    confirmButtonText: props.currencyCodeGot ? "修改" : "新增",
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

      dataParams.currencyCode = (document.getElementById("currencyCode") as HTMLInputElement).value;
      dataParams.currencyName = (document.getElementById("currencyName") as HTMLInputElement).value;
      dataParams.sort = Number((document.getElementById("sort") as HTMLInputElement).value);


      if (!dataParams.currencyCode) {
        errors.push("請填寫貨幣代碼");
      }
      if (!dataParams.currencyName) {
        errors.push("請填寫貨幣名稱");
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
        const res = await (props.currencyCodeGot ? fetchUpdateCurrency : fetchCreateCurrency)(result.value) as IResponse;
        console.log("res:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
        } else {
          categoryCodeDataHandling(res.data.message);
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
};


</script>
<style lang="scss" scoped></style>
