import { apiFetch } from "@/server/index.ts";



export async function fetchStockStorageProfitList(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockStorage/profit/list/${stockAccountId}`, "GET");
  return await response.json();
}
