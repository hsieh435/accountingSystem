import { apiFetch } from "@/server/index.ts";
import { IStockAccountList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchStockAccountList(data: IAccountSearchingParams) {
  const response = await apiFetch("/api/stockAccount/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountById(accountId: string) {
  const response = await apiFetch(`/api/stockAccountData/${accountId}`, "GET");
  return await response.json();
}

export async function fetchStockAccountCreate(data: IStockAccountList) {
  const response = await apiFetch("/api/stockAccount/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStockAccountUpdate(data: IStockAccountList) {
  const response = await apiFetch("/api/stockAccount/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchEnableStockAccount(accountId: string) {
  const response = await apiFetch(`/api/stockAccount/enable/${accountId}`, "GET");
  return await response.json();
}

export async function fetchDisableStockAccount(accountId: string) {
  const response = await apiFetch(`/api/stockAccount/disable/${accountId}`, "GET");
  return await response.json();
}

export async function fetchStockAccountDelete(accountId: string) {
  const response = await apiFetch(`/api/stockAccount/delete/${accountId}`, "GET");
  return await response.json();
}
