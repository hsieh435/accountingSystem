<template>
  <template v-if="props.storedValueCardIdGot">
    <ui-buttonGroup showView :viewText="'檢視儲值票卡'" @dataView="searchingStoredValueCardData()" />
    <ui-buttonGroup showRemove :createText="'刪除儲值票卡'" @dataRemove="removeStoredValueCardData()" />
  </template>
  <template v-if="!props.storedValueCardIdGot">
    <ui-buttonGroup showCreate :createText="'新增儲值票卡'" @dataCreate="storedValueCardDataHandling()" />
  </template>
</template>
<script setup lang="ts">
import { reactive, createApp, defineAsyncComponent } from "vue";
import {
  fetchStoredValueCardById,
  fetchStoredValueCardCreate,
  fetchStoredValueCardUpdate,
  fetchStoredValueCardDelete,
} from "@/server/storedValueCardApi";
import { IStoredValueCardList, IResponse } from "@/models/index";
import { yearMonthDayTimeFormat } from "@/composables/tools";
import { showAxiosToast, showAxiosErrorMsg, showConfirmDialog } from "@/composables/swalDialog";
import * as tailwindStyles from "@/assets/css/tailwindStyles";
import Swal from "sweetalert2";

const props = withDefaults(defineProps<{ storedValueCardIdGot?: string }>(), { storedValueCardIdGot: "" });
const emits = defineEmits(["dataReseaching"]);

const getDefaultDataParams = (): IStoredValueCardList => ({
  storedValueCardId: props.storedValueCardIdGot || "",
  userId: "",
  accountType: "storedValueCard",
  storedValueCardName: "",
  currency: "",
  startingAmount: 0,
  presentAmount: 0,
  minimumValueAllowed: 0,
  maximumValueAllowed: 0,
  alertValue: 0,
  openAlert: false,
  enable: true,
  createdDate: "",
  note: "",
});
const dataParams = reactive<IStoredValueCardList>(getDefaultDataParams());

async function searchingStoredValueCardData() {
  console.log("props:", props);
  try {
    const res: IResponse = await fetchStoredValueCardById(props.storedValueCardIdGot);
    console.log("fetchStoredValueCardById:", res.data.data);
    if (res.data.returnCode === 0) {
      dataParams.storedValueCardId = res.data.data.storedValueCardId;
      dataParams.userId = res.data.data.userId;
      dataParams.storedValueCardName = res.data.data.storedValueCardName;
      dataParams.currency = res.data.data.currency;
      dataParams.startingAmount = res.data.data.startingAmount;
      dataParams.presentAmount = res.data.data.presentAmount;
      dataParams.minimumValueAllowed = res.data.data.minimumValueAllowed;
      dataParams.maximumValueAllowed = res.data.data.maximumValueAllowed;
      dataParams.alertValue = res.data.data.alertValue;
      dataParams.openAlert = res.data.data.openAlert;
      dataParams.createdDate = res.data.data.createdDate;
      dataParams.note = res.data.data.note;
      await storedValueCardDataHandling();
    } else {
      showAxiosErrorMsg({ message: res.data.message });
    }
  } catch (error) {
    showAxiosErrorMsg({ message: (error as Error).message });
  }
}

async function storedValueCardDataHandling(apiMsg?: string) {
  // console.log(dataParams);

  Swal.fire({
    title: props.storedValueCardIdGot ? "修改儲值票卡資料" : "新增儲值票卡資料",
    html: `
      <div class="d-flex flex-row items-center rounded-md">
        <span><span class="text-red-600 mx-1">∗</span>為必填欄位</span>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>儲值票卡名稱：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="storedValueCardName" value="${dataParams.storedValueCardName}" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>結算貨幣：</span>
          <div id="dataBaseCurrencySelectComponent"></div>
        </div>


        ${
          props.storedValueCardIdGot
            ? `<div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">目前金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="presentAmount" value="${dataParams.presentAmount}" type="number" disabled />
        </div>`
            : `
        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>初始金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="startingAmount" value="${dataParams.startingAmount}" type="number" ${props.storedValueCardIdGot ? "disabled" : ""} />
        </div>`
        }


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最小儲值金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="minimumValueAllowed" value="${dataParams.minimumValueAllowed}" type="number" />
        </div>

        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right"><span class="text-red-600 mx-1">∗</span>最大儲值金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="maximumValueAllowed" value="${dataParams.maximumValueAllowed}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
          <span class="col-start-1 col-end-3 text-right">提醒金額：</span>
          <input class="${tailwindStyles.getInputClasses()}" id="alertValue" value="${dataParams.alertValue}" type="number" />
        </div>


        <div class="flex justify-start items-center grid grid-cols-6 my-2">
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
          props.storedValueCardIdGot
            ? `
          <div class="flex justify-start items-center grid grid-cols-6 my-2">
            <span class="col-start-1 col-end-3 text-right">建立時間：</span>
            <input class="${tailwindStyles.getInputClasses()}" id="createdDate" value="${yearMonthDayTimeFormat(dataParams.createdDate)}" disabled />
          </div>`
            : ""
        }

      </div>
    `,
    confirmButtonText: props.storedValueCardIdGot ? "修改" : "新增",
    showCancelButton: true,
    cancelButtonText: "取消",
    allowOutsideClick: false,
    didOpen: () => {
      let dataBaseCurrencySelect = createApp(
        defineAsyncComponent(() => import("@/components/ui/select/dataBaseCurrencySelect.vue")),
        {
          currencyIdGot: dataParams.currency || "",
          isDisable: props.storedValueCardIdGot ? true : false,
          onSendbackCurrencyId: (currencyId: string) => {
            dataParams.currency = currencyId;
          },
        },
      );
      dataBaseCurrencySelect.mount("#dataBaseCurrencySelectComponent");

      // const startingAmount = document.getElementById("startingAmount") as HTMLInputElement;
      const minimumValueAllowed = document.getElementById("minimumValueAllowed") as HTMLInputElement;
      const maximumValueAllowed = document.getElementById("maximumValueAllowed") as HTMLInputElement;
      const alertValue = document.getElementById("alertValue") as HTMLInputElement;
      minimumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      maximumValueAllowed.addEventListener("change", () => {
        validateAlertValue();
      });
      alertValue.addEventListener("change", () => {
        validateAlertValue();
      });

      function validateAlertValue() {
        // console.log("minimumValueAllowed:", minimumValueAllowed.value);
        // console.log("maximumValueAllowed:", maximumValueAllowed.value);
        // console.log("alertValue:", alertValue.value);

        maximumValueAllowed.min = minimumValueAllowed.value;
        minimumValueAllowed.max = maximumValueAllowed.value;
        // startingAmount.max = maximumValueAllowed.value;
        // startingAmount.min = minimumValueAllowed.value;
        alertValue.max = maximumValueAllowed.value;
        alertValue.min = minimumValueAllowed.value;

        if (Number(alertValue.value) < Number(minimumValueAllowed.value)) {
          alertValue.value = minimumValueAllowed.value;
        }
        if (Number(alertValue.value) > Number(maximumValueAllowed.value)) {
          alertValue.value = maximumValueAllowed.value;
        }
        if (Number(minimumValueAllowed.value) > Number(maximumValueAllowed.value)) {
          minimumValueAllowed.value = maximumValueAllowed.value;
        }
        if (Number(maximumValueAllowed.value) < Number(minimumValueAllowed.value)) {
          maximumValueAllowed.value = minimumValueAllowed.value;
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

      dataParams.storedValueCardName = (document.getElementById("storedValueCardName") as HTMLInputElement).value;
      if (!dataParams.storedValueCardId) {
        dataParams.startingAmount = Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      }
      dataParams.presentAmount = props.storedValueCardIdGot
        ? Number((document.getElementById("presentAmount") as HTMLInputElement).value)
        : Number((document.getElementById("startingAmount") as HTMLInputElement).value);
      dataParams.minimumValueAllowed = Number(
        (document.getElementById("minimumValueAllowed") as HTMLInputElement).value,
      );
      dataParams.maximumValueAllowed = Number(
        (document.getElementById("maximumValueAllowed") as HTMLInputElement).value,
      );
      dataParams.alertValue = Number((document.getElementById("alertValue") as HTMLInputElement).value);
      dataParams.note = (document.getElementById("note") as HTMLTextAreaElement).value;

      if (!dataParams.storedValueCardName) {
        errors.push("請填寫儲值票卡名稱");
      }
      if (!dataParams.currency) {
        errors.push("請填寫票卡結算貨幣");
      }
      if (isNaN(dataParams.startingAmount)) {
        errors.push("請填寫儲值票卡初始金額");
      }
      if (isNaN(dataParams.minimumValueAllowed)) {
        errors.push("請填寫儲值票卡最小儲值金額");
      }
      if (isNaN(dataParams.maximumValueAllowed)) {
        errors.push("請填寫儲值票卡最大儲值金額");
      }
      if (dataParams.maximumValueAllowed <= dataParams.minimumValueAllowed) {
        errors.push("儲值票卡最小儲值金額必須小於最大儲值金額");
      }
      if (isNaN(dataParams.alertValue) || dataParams.alertValue < 0) {
        errors.push("請填寫提醒金額");
      }
      if (
        dataParams.alertValue < dataParams.minimumValueAllowed ||
        dataParams.alertValue > dataParams.maximumValueAllowed
      ) {
        errors.push("提醒金額需介於最小儲值金額與最大儲值金額之間");
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
        const res: IResponse = await (
          props.storedValueCardIdGot ? fetchStoredValueCardUpdate : fetchStoredValueCardCreate
        )(result.value);
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

async function removeStoredValueCardData() {
  const confirmResult = await showConfirmDialog({
    message: "即將刪除儲值票卡資料",
    confirmButtonMsg: "確認刪除",
    executionApi: fetchStoredValueCardDelete,
    apiParams: props.storedValueCardIdGot,
  });

  if (confirmResult) {
    emits("dataReseaching");
  }
}
</script>
<style lang="scss" scoped></style>
