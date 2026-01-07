import { apiFetch } from "@/server/index.ts";
import { ICashFlowList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchCashFlowList(data: IAccountSearchingParams) {
  const response = await apiFetch("/api/cashFlow/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowById(cashFlowId: string) {
  const response = await apiFetch(`/api/cashFlowData/${cashFlowId}`, "GET");
  return await response.json();
}

export async function fetchCashFlowCreate(data: ICashFlowList) {
  const response = await apiFetch("/api/cashFlow/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowUpdate(data: ICashFlowList) {
  const response = await apiFetch("/api/cashFlow/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchEnableCashFlow(cashFlowId: string) {
  const response = await apiFetch(`/api/cashFlow/enable/${cashFlowId}`, "GET");
  return await response.json();
}

export async function fetchDisableCashFlow(cashFlowId: string) {
  const response = await apiFetch(`/api/cashFlow/disable/${cashFlowId}`, "GET");
  return await response.json();
}

export async function fetchCashFlowDelete(cashflowId: string) {
  const response = await apiFetch(`/api/cashFlow/delete/${cashflowId}`, "GET");
  return await response.json();
}
