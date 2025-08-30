import { apiFetch } from "@/server";
import { ICashFlowRecordList, IFinanceRecordSearchingParams } from "@/models";

export async function fetchCashFlowRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlowRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordByTradeId(data: { cashflowId: string; tradeId: string }) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlowRecord`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordCreate(data: ICashFlowRecordList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlowRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordUpdate(data: ICashFlowRecordList) {
  const response = await apiFetch("/accounting_system_backend/api/cashFlowRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowDelete(cashFlowRecordId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashFlowRecord/delete/${cashFlowRecordId}`, "GET");
  return await response.json();
}
