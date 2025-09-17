import { apiFetch } from "@/server/index.ts";
import { IStoredValueCardList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchStoredValueCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCard/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardById(storedValueCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/storedValueCard/${storedValueCardId}`, "GET");
  return await response.json();
}

export async function fetchStoredValueCardCreate(data: IStoredValueCardList) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCard/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardUpdate(data: IStoredValueCardList) {
  const response = await apiFetch("/accounting_system_backend/api/storedValueCard/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardDelete(storedValueCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/storedValueCard/delete/${storedValueCardId}`, "GET");
  return await response.json();
}

export async function fetchEnableStoredValueCard(storedValueCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/storedValueCard/enable/${storedValueCardId}`, "GET");
  return await response.json();
}

export async function fetchDisableStoredValueCard(storedValueCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/storedValueCard/disable/${storedValueCardId}`, "GET");
  return await response.json();
}
