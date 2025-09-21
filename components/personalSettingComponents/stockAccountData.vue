<template>
  <template v-if="props.stockAccountIGot">
    <ui-buttonGroup showView :viewText="'檢視證券帳戶'" @dataView="searchingStockAccountData()" />
    <ui-buttonGroup showRemove :createText="'刪除證券帳戶'" @dataRemove="removeStockAccountData()" />
  </template>
  <template v-if="!props.stockAccountIGot">
    <ui-buttonGroup showCreate :createText="'新增證券帳戶'" @dataCreate="stockAccountDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import {
  fetchStockAccountById,
  fetchStockAccountCreate,
  fetchStockAccountUpdate,
  fetchStockAccountDelete,
} from "@/server/stockAccountApi";
import { IStockAccountList, IResponse } from "@/models/index";
import { currencyFormat, yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ stockAccountIGot?: string }>(), { stockAccountIGot: "" });
const emits = defineEmits(["dataReseaching"]);

const getDefaultDataParams = (): IStockAccountList => ({
  accountId: props.stockAccountIGot || "",
  userId: "",
  accountType: "stockAccount",
  accountName: "",
  accountBankCode: "",
  accountBankName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<IStockAccountList>(getDefaultDataParams());

async function searchingStockAccountData() {
  console.log(props.stockAccountIGot);
  try {
    const res: IResponse = await fetchStockAccountById(props.stockAccountIGot);
    if (res.data.returnCode === 0) {
      dataParams.accountId = res.data.data.accountId;
      dataParams.userId = res.data.data.userId;
      dataParams.accountName = res.data.data.accountName;
      dataParams.accountBankCode = res.data.data.accountBankCode;
      dataParams.accountBankName = res.data.data.accountBankName;
      dataParams.currency = res.data.data.currency;
      dataParams.alertValue = res.data.data.alertValue;
      dataParams.openAlert = res.data.data.openAlert;
      dataParams.createdDate = res.data.data.createdDate;
      dataParams.note = res.data.data.note;

      await stockAccountDataHandling();
    } else {
      showAxiosToast({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function stockAccountDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.stockAccountIGot ? "修改存款帳戶資料" : "新增存款帳戶資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>證券帳戶號碼：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="accountId" value="${dataParams.accountId}" ${props.stockAccountIGot ? `disabled` : ""} />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>證券帳戶名稱：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="accountName" value="${dataParams.accountName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行代碼：</span>
          <input class="col-span-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1" id="accountBankCode" maxlength="3" value="${dataParams.accountBankCode}" />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">銀行名稱：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="accountBankName" value="${dataParams.accountBankName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>結算貨幣：</span>
          <div id="dataBaseCurrencySelectComponent"></div>
        </div>


        ${
          props.stockAccountIGot
            ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="presentAmount" value="${currencyFormat(dataParams.presentAmount)}" disabled />
        </div>`
            : `<div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="startingAmount" value="${dataParams.startingAmount}" type="number" />
        </div>`
        }


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最小允許金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>提醒金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 w-full my-2">
          <span class="col-start-1 col-end-3 text-right">提醒：</span>
          <div class="flex justify-start items-center">
            <div id="switchComponent"></div>
          </div>
        </div>


        <div class="flex justify-start items-start grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right my-1">附註：</span>
          <textarea class="${tailwindStyles.getInputClasses()}" id="note" rows="6">${dataParams.note}</textarea>
        </div>


        ${
          props.stockAccountIGot
            ? `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">建立時間：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="createdDate" value="${yearMonthDayTimeFormat(dataParams.createdDate)}" disabled />
        </div>`
            : ""
        }

      </div>
    `,
    confirmButtonText: props.stockAccountIGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      let dataBaseCurrencySelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue")),
        {
          currencyIdGot: dataParams.currency || "",
          isDisable: props.stockAccountIGot ? true : false,
          onSendbackCurrencyId: (currencyId: string) => {
            dataParams.currency = currencyId;
          },
        },
      );
      dataBaseCurrencySelect.mount("#dataBaseCurrencySelectComponent");

      const minimumValueAllowed = document.getElementById("minimumValueAllowed") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      minimumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        alertValue.min = minimumValueAllowed.value;

        if (Number(alertValue.value) < Number(minimumValueAllowed.value)) {
          alertValue.value = minimumValueAllowed.value;
        }
      }

      let switchComponent = createApp(
        defineAsyncComponent(() => import("@/components/ui/switch.vue")),
        {
          switchValueGot: dataParams.openAlert,
          onSendBackSwitchValue: (switchValue: boolean) => {
            dataParams.openAlert = switchValue;
          },
        },
      );
      switchComponent.mount("#switchComponent");

      if (apiMsg) {
        Swal.showValidationMessage(apiMsg);
        return false;
      }
    },
    preConfirm: () => {
      const errors: string[] = [];

      dataParams.accountId = (document.getElementById("accountId") as HTMLInputElement).value;
      dataParams.accountName = (document.getElementById("accountName") as HTMLInputElement).value;
      dataParams.accountBankCode = (document.getElementById("accountBankCode") as HTMLInputElement).value;
      dataParams.accountBankName = (document.getElementById("accountBankName") as HTMLInputElement).value;
      if (!props.stockAccountIGot) {
        dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      }
      dataParams.minimumValueAllowed = Number(
        (document.getElementById("minimumValueAllowed") as HTMLInputElement).value,
      );

      dataParams.presentAmount = props.stockAccountIGot
        ? Number((document.getElementById("presentAmount") as HTMLInputElement).value)
        : Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.note = (document.getElementById("note") as HTMLTextAreaElement).value;

      if (!dataParams.accountId) {
        errors.push("請填寫存款帳戶號碼");
      }
      if (!dataParams.accountName) {
        errors.push("請填寫存款帳戶名稱");
      }
      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫帳戶初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed)) {
        errors.push("請填寫帳戶最小允許金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (dataParams.alertValue < dataParams.minimumValueAllowed) {
        errors.push("提醒金額不得低於最小允許金額");
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
        const res: IResponse = await (props.stockAccountIGot ? fetchStockAccountUpdate : fetchStockAccountCreate)(
          result.value,
        );
        // console.log("RES:", res);
        if (res.data.returnCode === 0) {
          showAxiosToast({ message: res.data.message });
          emits("dataReseaching");
          Object.assign(dataParams, getDefaultDataParams());
        } else {
          showAxiosErrorMsg({ message: res.data.message });
        }
      } catch (error) {
        showAxiosErrorMsg({ message: (error as Error).message });
      }
    }
  });
}

async function removeStockAccountData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除證券帳戶資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchStockAccountDelete,
    apiParams: props.stockAccountIGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
