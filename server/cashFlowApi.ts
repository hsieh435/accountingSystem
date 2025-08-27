import { apiFetch } from "@/server";
import { ICashFlowList, IAccountSearchingParams } from "@/models";

export async function fetchCashFlowList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowById(cashFlowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlowData/${cashFlowId}`, "GET");
  return await response.json();
}

export async function fetchCashFlowCreate(data: ICashFlowList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowUpdate(data: ICashFlowList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchEnableCashFlow(cashFlowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlow/enable/${cashFlowId}`, "GET");
  return await response.json();
}

export async function fetchDisableCashFlow(cashFlowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlow/disable/${cashFlowId}`, "GET");
  return await response.json();
}


export async function fetchCashFlowDelete(cashflowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlow/delete/${cashflowId}`, "GET");
  return await response.json();
}
