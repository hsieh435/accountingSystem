import { apiFetch } from "@/server/index";
import { IResponse, ITradeCategory } from "@/models/index";



export async function fetchStockList() {
  const response = await apiFetch("/accounting_system_backend/api/outSideWebApi/stockList", "GET", {});
  console.log("response:", response);

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: any };
  return result;
}



export async function fetchEachStockList(ex_ch: string) {
  const response = await apiFetch(`/accounting_system_backend/api/outSideWebApi/${ex_ch}`, "GET", {});
//   console.log("response:", response);

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: any };
  console.log("response:", result.data.data);
  return result;
}

