import { apiFetch } from "@/server";
import { ICashFlowList, IAccountSearchingParams } from "@/models";

export async function fetchCashFlowList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/List", "POST", {
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = (await response.json()) as { data: ICashFlowList[] };
  return result;
}

export async function fetchCashFlowById(cashFlowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlowData/${cashFlowId}`, "GET");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = (await response.json()) as { data: ICashFlowList[] };
  return result;
}

export async function fetchCashFlowCreate(data: ICashFlowList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/create", "POST", {
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = (await response.json()) as { data: ICashFlowList[] };
  return result;
}

export async function fetchCashFlowUpdate(data: ICashFlowList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/update", "PUT", {
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = (await response.json()) as { data: ICashFlowList[] };
  return result;
}

export async function fetchCashFlowDelete(cashflowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlow/delete/${cashflowId}`, "GET");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = await response.json();
  return result;
}
