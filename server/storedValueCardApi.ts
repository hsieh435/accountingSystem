import { apiFetch } from "@/server/index.ts";
import { IStoredValueCardList, IAccountSearchingParams } from "@/models/index.ts";

export async function fetchStoredValueCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/api/storedValueCard/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardById(storedValueCardId: string) {
  const response = await apiFetch(`/api/storedValueCard/${storedValueCardId}`, "GET");
  return await response.json();
}

export async function fetchStoredValueCardCreate(data: IStoredValueCardList) {
  const response = await apiFetch("/api/storedValueCard/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardUpdate(data: IStoredValueCardList) {
  const response = await apiFetch("/api/storedValueCard/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchStoredValueCardDelete(storedValueCardId: string) {
  const response = await apiFetch(`/api/storedValueCard/delete/${storedValueCardId}`, "GET");
  return await response.json();
}

export async function fetchEnableStoredValueCard(storedValueCardId: string) {
  const response = await apiFetch(`/api/storedValueCard/enable/${storedValueCardId}`, "GET");
  return await response.json();
}

export async function fetchDisableStoredValueCard(storedValueCardId: string) {
  const response = await apiFetch(`/api/storedValueCard/disable/${storedValueCardId}`, "GET");
  return await response.json();
}
