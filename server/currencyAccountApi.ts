import { apiFetch } from "@/server/index.ts";
import { ICurrencyAccountList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchCurrencyAccountList(data: IAccountSearchingParams) {
  const response = await apiFetch("/api/currencyAccount/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountById(currencyAccountId: string) {
  const response = await apiFetch(`/api/currencyAccountData/${currencyAccountId}`, "GET");
  return await response.json();
}

export async function fetchCurrencyAccountCreate(data: ICurrencyAccountList) {
  const response = await apiFetch("/api/currencyAccount/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCurrencyAccountUpdate(data: ICurrencyAccountList) {
  const response = await apiFetch("/api/currencyAccount/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchEnableCurrencyAccount(accountId: string) {
  const response = await apiFetch(`/api/currencyAccount/enable/${accountId}`, "GET");
  return await response.json();
}

export async function fetchDisableCurrencyAccount(accountId: string) {
  const response = await apiFetch(`/api/currencyAccount/disable/${accountId}`, "GET");
  return await response.json();
}

export async function fetchCurrencyAccountDelete(data: { accountId: string, currency: string }) {
  const response = await apiFetch(`/api/currencyAccount/delete`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
