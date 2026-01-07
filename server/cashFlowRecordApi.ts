import { apiFetch } from "@/server/index.ts";
import { ICashFlowRecordData, IFinanceRecordSearchingParams } from "@/models/index.ts";

export async function fetchCashFlowRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/api/cashFlowRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordByTradeId(data: { cashflowId: string; tradeId: string }) {
  const response = await apiFetch("/api/cashFlowRecord", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordCreate(data: ICashFlowRecordData) {
  const response = await apiFetch("/api/cashFlowRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordUpdate(data: ICashFlowRecordData) {
  const response = await apiFetch("/api/cashFlowRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashFlowRecordDelete(cashFlowRecordId: string) {
  const response = await apiFetch(`/api/cashFlowRecord/delete/${cashFlowRecordId}`, "GET");
  return await response.json();
}
