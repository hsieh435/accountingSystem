import { apiFetch } from "@/server/index.ts";
import { IStoredValueCardRecordData, IFinanceRecordSearchingParams } from "@/models/index.ts";

export async function fetchStoredValueCardRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/api/storedValueCardRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordById(data: { storedValueCardId: string; tradeId: string }) {
  const response = await apiFetch("/api/storedValueCardRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordCreate(data: IStoredValueCardRecordData) {
  const response = await apiFetch("/api/storedValueCardRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordUpdate(data: IStoredValueCardRecordData) {
  const response = await apiFetch("/api/storedValueCardRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordDelete(data: { tradeId: string; storedValueCardId: string }) {
  const response = await apiFetch(`/api/storedValueCardRecord/delete`, "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}
