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
  } catch (error: any) {
    const errorMsg = JSON.parse(await error.response.data.text()).message;
    errorMessageDialog({ message: errorMsg });
  }
}

export async function mustValidatedColumnChecking(response: any, target: string = "") {
  await resetOutline();

  const columnNameArray = Object.keys(response.data.data);
  const validFeedback: string[] = Object.values(response.data.data);
  const range = document.getElementById(target) as HTMLElement;

  if (range) {
    for (let i = 0; i < columnNameArray.length; i++) {
      const elements = range.querySelectorAll(`#${columnNameArray[i]}`);
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.outline = "2px solid red";
        htmlElement.setAttribute("title", validFeedback[i]);
      });
    }
  } else {
    for (let i = 0; i < columnNameArray.length; i++) {
      const element = document.getElementById(columnNameArray[i]) as HTMLElement;
      element.style.outline = "2px solid red";
      element.setAttribute("title", validFeedback[i]);
    }
  }

  errorMessageDialog({ message: "必填欄位資料錯誤" });
}

export async function resetOutline() {
  document.querySelectorAll<HTMLElement>(".must_checked").forEach((el) => {
    el.style.outline = "0px solid red";
    el.title = "";
  });
}
