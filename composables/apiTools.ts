import { errorMessageDialog } from "@/composables/swalDialog.ts";

export async function downloadFunction({
  downloadApi,
  functionParams = {},
}: {
  downloadApi: Function;
  functionParams?: any;
}) {
  try {
    const res = await downloadApi(functionParams);
    if (res.status === 200 && res.headers.hasOwnProperty("content-disposition")) {
      const disposition = res.headers["content-disposition"];
      // let fileName = disposition.substring(disposition.indexOf("utf-8''") + 7, disposition.length);
      const link = document.createElement("a");
      // const blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
      link.style.display = "none";
      link.href = URL.createObjectURL(new Blob([res.data], { type: "application/vnd.ms-excel" }));
      link.setAttribute("download", decodeURI(disposition.substring(disposition.indexOf("utf-8''") + 7)));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      errorMessageDialog({ message: res.data?.message || "下載失敗" });
    }
  } catch (error) {
    errorMessageDialog({ message: (error as Error).message, icon: "error" });
  }
}
