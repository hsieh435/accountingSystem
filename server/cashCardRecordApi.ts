import { apiFetch } from "@/server";
import { ICashCardList, IAccountSearchingParams } from "@/models";

export async function fetchCashCardList(data: IAccountSearchingParams) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/list", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardById(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCardData/${cashCardId}`, "GET");
  return await response.json();
}

export async function fetchCashCardCreate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/create", "POST", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardUpdate(data: ICashCardList) {
  const response = await apiFetch("/accounting_system_backend/api/cashCard/update", "PUT", {
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchCashCardDelete(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCard/delete/${cashCardId}`, "GET");
  return await response.json();
}

export async function fetchEnableCashCard(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCard/enable/${cashCardId}`, "GET");
  return await response.json();
}

export async function fetchDisableCashCard(cashCardId: string) {
  const response = await apiFetch(`/accounting_system_backend/api/cashCard/disable/${cashCardId}`, "GET");
  return await response.json();
}
