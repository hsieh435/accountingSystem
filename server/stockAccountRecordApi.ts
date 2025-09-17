import { apiFetch } from "@/server/index.ts";
import { IStockAccountRecordList, IFinanceRecordSearchingParams } from "@/models/index.ts";

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

export async function fetchStockAccountRecordCreate(data: IStockAccountRecordList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordUpdate(data: IStockAccountRecordList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordDelete(data: IStockAccountRecordList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccountRecord/delete", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
