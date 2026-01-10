import { IResponse } from "@/models/index.ts";
import Swal from "sweetalert2";

function getSwalIcon(icon: string) {
  switch (icon) {
    case "success":
    case "info":
    case "warning":
    case "question":
    case "error":
      return icon;
    default:
      return "error";
  }
}

export function messageToast({
  message,
  icon = "success",
  existTime = 1500,
}: {
  message: string;
  icon?: string;
  existTime?: number;
}) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: existTime,
    timerProgressBar: false,
    width: "auto",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: getSwalIcon(icon),
    text: message,
  });
}

export function errorMessageDialog({
  message,
  icon = "error",
  hasConfirmButton = false,
}: {
  message: string;
  icon?: string;
  hasConfirmButton?: boolean;
}) {
  Swal.fire({
    icon: getSwalIcon(icon),
    title: message,
    showConfirmButton: hasConfirmButton,
    confirmButtonText: "確定",
    width: "auto",
    color: "rgb(0, 0, 0)",
  });
}

export async function showConfirmDialog({
  message,
  text = "",
  confirmButtonMsg = "確定",
  cancelButtonText = "取消",
  icon = "warning",
  showCancelButton = true,
  executionApi,
  apiParams,
}: {
  message: string;
  text?: string;
  confirmButtonMsg?: string;
  cancelButtonText?: string;
  icon?: string;
  showCancelButton?: boolean;
  executionApi?: Function;
  apiParams?: any;
}): Promise<boolean> {
  return Swal.fire({
    title: message,
    text: text,
    icon: getSwalIcon(icon),
    showCancelButton: showCancelButton,
    confirmButtonText: confirmButtonMsg,
    cancelButtonText: cancelButtonText,
    width: message.length > 14 ? "auto" : "",
  }).then(async (result) => {
    if (typeof executionApi === "function" && result.isConfirmed) {
      try {
        const res: IResponse = await executionApi(apiParams);
        console.log("res:", res);
        if (res.data.returnCode === 0) {
          messageToast({ message: res.data.message });
          return true;
        } else {
          errorMessageDialog({ message: res.data.message });
          return false;
        }
      } catch (error) {
        errorMessageDialog({ message: (error as Error).message });
        return false;
      }
    } else if (typeof executionApi !== "function" && result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  });
}

export function showDataLengthMsg({
  dataLength,
  dataName = "資料",
  hasData = false,
  hasDataMsg = "",
}: {
  dataLength: number;
  dataName?: string;
  hasData?: boolean;
  hasDataMsg?: string;
}): void {
  if (dataLength === 0) {
    messageToast({ message: `查無${dataName}，請重新搜尋`, icon: "warning", existTime: 2000 });
  } else if (dataLength > 0 && hasData) {
    messageToast({ message: hasDataMsg, icon: "success", existTime: 2000 });
  }
}
