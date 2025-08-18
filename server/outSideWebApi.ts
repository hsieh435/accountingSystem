import { apiFetch } from "@/server/index";



export async function fetchStockList() {
  const response = await apiFetch("/accounting_system_backend/api/outSideWebApi/stockList", "GET", {});
  // console.log("response:", response);
  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }
  // const result = await response.json() as { data: any };
  return await response.json();
}



export async function fetchEachStockList(ex_ch: string) {
  const response = await apiFetch(`/accounting_system_backend/api/outSideWebApi/${ex_ch}`, "GET");
  // console.log("response:", response);
  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }
  // const result = await response.json() as { data: any };
  return await response.json();
}
