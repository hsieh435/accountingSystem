import { apiFetch } from "@/server";
import { IStoredValueCardList, IFinanceRecordSearchingParams } from "@/models";

export async function fetchStoredValueCardRecordList(data: IFinanceRecordSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCardRecord/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordById(data: { storedValueCardId: string; tradeId: string }) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCardRecordById", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordCreate(data: IStoredValueCardList) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCardRecord/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordUpdate(data: IStoredValueCardList) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCardRecord/update", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardRecordDelete(storedValueCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/storedValueCardRecord/delete/${storedValueCardId}`, "GET");
  return await response.json();
}
