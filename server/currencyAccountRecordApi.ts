import { apiFetch } from "@/server/index.ts";
import { IcurrencyAccountRecordData, IFinanceRecordSearchingParams } from "@/models/index.ts";

export async function fetchCurrencyAccountRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/api/currencyAccountRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordById(data: { tradeId: string; accountId: string }) {
  const response = await apiFetch("/api/currencyAccountRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordCreate(data: IcurrencyAccountRecordData) {
  const response = await apiFetch("/api/currencyAccountRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordUpdate(data: IcurrencyAccountRecordData) {
  const response = await apiFetch("/api/currencyAccountRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordDelete(data: IcurrencyAccountRecordData) {
  const response = await apiFetch(`/api/currencyAccountRecord/delete`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
