import { apiFetch } from "@/server";
import { IStockAccountList, IAccountSearchingParams } from "@/models";

export async function fetchStockAccountList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccount/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountById(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockAccountData/${stockAccountId}`, "GET");
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }
  // const result = (await response.json()) as { data: IStockAccountList[] };
  return await response.json();
}

export async function fetchStockAccountCreate(data: IStockAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccount/create", "POST", {
    body: JSON.stringify(data),
  });
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }
  // const result = (await response.json()) as { data: IStockAccountList[] };
  return await response.json();
}

export async function fetchStockAccountUpdate(data: IStockAccountList) {
  const response = await apiFetch("/accounting_system_backend/api/stockAccount/update", "PUT", {
    body: JSON.stringify(data),
  });
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }
  // const result = (await response.json()) as { data: IStockAccountList[] };
  return await response.json();
}

export async function fetchEnableStockAccount(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockAccount/enable/${stockAccountId}`, "GET");
  return await response.json();
}

export async function fetchDisableStockAccount(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockAccount/disable/${stockAccountId}`, "GET");
  return await response.json();
}

export async function fetchStockAccountDelete(stockAccountId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/stockAccountData/delete/${stockAccountId}`, "GET");
  // if (!response.ok) {
  //   const errorText = await response.text();
  //   throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  // }
  // const result = await response.json();
  return await response.json();
}
