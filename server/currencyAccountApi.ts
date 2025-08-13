import { apiFetch } from "@/server";
import { ICurrencyAccountList, IAccountSearchingParams } from "@/models";

export async function fetchCurrencyAccountList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccount/List", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountById(currencyAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccountData/${currencyAccountId}`, "GET");
  return await response.json();
}

export async function fetchCurrencyAccountCreate(data: ICurrencyAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccount/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountUpdate(data: ICurrencyAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccount/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountDelete(currencyAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccount/delete/${currencyAccountId}`, "GET");
  return await response.json();
}


export async function fetchEnableCurrencyAccount(currencyAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccount/enable/${currencyAccountId}`, "GET");
  return await response.json();
}

export async function fetchDisableCurrencyAccount(currencyAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccount/disable/${currencyAccountId}`, "GET");
  return await response.json();
}
