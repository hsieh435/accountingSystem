import { apiFetch } from "@/server";
import { IStockAccountList, IFinanceRecordSearchingParams } from "@/models";

export async function fetchStockAccountRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordById(data: { tradeId: string; accountId: string }) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordCreate(data: IStockAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordUpdate(data: IStockAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordDelete(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockAccountRecord/delete/${stockAccountId}`, "GET");
  return await response.json();
}
