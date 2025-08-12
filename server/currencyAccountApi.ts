import { apiFetch } from "@/server";
import { ICurrencyAccountList, IAccountSearchingParams } from "@/models";

export async function fetchCurrencyAccountList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccount/List", "POST", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   throw new Error("HTTP error! status:" + response.status);
  // }

  const result = (await response.json()) as { data: ICurrencyAccountList[] };
  return result;
}

export async function fetchCurrencyAccountById(currencyAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccountData/${currencyAccountId}`, "GET");

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICurrencyAccountList[] };
  return result;
}

export async function fetchCurrencyAccountCreate(data: ICurrencyAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccount/create", "POST", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICurrencyAccountList[] };
  return result;
}

export async function fetchCurrencyAccountUpdate(data: ICurrencyAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/currencyAccount/update", "PUT", {
    body: JSON.stringify(data),
  });

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = (await response.json()) as { data: ICurrencyAccountList[] };
  return result;
}

export async function fetchCurrencyAccountDelete(currencyAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/currencyAccount/delete/${currencyAccountId}`, "GET");

  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }

  const result = await response.json();
  return result;
}
