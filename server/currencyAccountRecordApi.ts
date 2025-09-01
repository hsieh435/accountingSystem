import { apiFetch } from "@/server";
import { ICurrencyAccountList, IFinanceRecordSearchingParams } from "@/models";

export async function fetchCurrencyAccountRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccountRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordById(data: { tradeId: string; accountId: string }) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccountRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordCreate(data: ICurrencyAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccountRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountRecordUpdate(data: ICurrencyAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccountRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}


export async function fetchCurrencyAccountRecordDelete(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccountRecord/delete`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
