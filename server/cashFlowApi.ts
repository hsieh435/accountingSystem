import { apiFetch } from "@/server";
import { ICashFlowList } from "@/models";



export async function fetchCashFlowList(data: { currencyId: string }) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/List", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    throw new Error("HTTP error! status:" + response.status);
  }

  const result = await response.json() as { data: ICashFlowList[] };
  return result;
}



export async function fetchCashFlowById(cashFlowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlowData/${cashFlowId}`, "GET");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = await response.json() as { data: ICashFlowList[] };
  return result;
}



export async function fetchCreateCashFlow(data: ICashFlowList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/create", "POST", { body: JSON.stringify(data) });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = await response.json() as { data: ICashFlowList[] };
  return result;
}



export async function fetchUpdateCashFlow(data: ICashFlowList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlow/update", "PUT", { body: JSON.stringify(data) });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = await response.json() as { data: ICashFlowList[] };
  return result;
};



export async function fetchDeleteCashFlow(cashflowId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlow/delete/${cashflowId}`, "GET");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("HTTP error! status:" + response.status + ", message:" + errorText);
  }

  const result = await response.json();
  return result;
};
