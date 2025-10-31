import { apiFetch } from "@/server/index.ts";



export async function fetchStockStorageProfitList(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockStorage/profit/list/${stockAccountId}`, "GET");
  return await response.json();
}



export async function fetchEachStockStorageData(data: { stockAccountId: string, stockNo: string }) {
  const response = await apiFetch("/accounting_system_backend/api/stockStorage/profit/StockNo", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
