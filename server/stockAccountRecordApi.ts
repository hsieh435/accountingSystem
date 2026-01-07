import { apiFetch } from "@/server/index.ts";
import { IStockAccountRecordData, IFinanceRecordSearchingParams } from "@/models/index.ts";

export async function fetchStockAccountRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/api/stockAccountRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordById(data: { tradeId: string; accountId: string }) {
  const response = await apiFetch("/api/stockAccountRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordCreate(data: IStockAccountRecordData) {
  const response = await apiFetch("/api/stockAccountRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordUpdate(data: IStockAccountRecordData) {
  const response = await apiFetch("/api/stockAccountRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountRecordDelete(data: { tradeId: string; accountId: string }) {
  const response = await apiFetch("/api/stockAccountRecord/delete", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
